import { Router, Request, Response } from "express";
import { supabase } from "../database/supabase";
import { calculateDistance } from "../utils/distance";

const router = Router();

interface Earthquake {
  id: string;
  datetime: string;
  timestamp: number;
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  region: string;
  tsunami_potential: string | null;
  felt_status: string | null;
  shakemap_url: string | null;
  created_at: number;
}

/**
 * GET /api/earthquakes
 * Get all earthquakes with optional filters
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: "Database not configured",
      });
    }

    const {
      limit = "50",
      offset = "0",
      minMagnitude,
      maxMagnitude,
    } = req.query;

    let query = supabase
      .from("earthquakes")
      .select("*", { count: "exact" })
      .order("timestamp", { ascending: false });

    if (minMagnitude) {
      query = query.gte("magnitude", parseFloat(minMagnitude as string));
    }

    if (maxMagnitude) {
      query = query.lte("magnitude", parseFloat(maxMagnitude as string));
    }

    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);

    query = query.range(offsetNum, offsetNum + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        total: count || 0,
        limit: limitNum,
        offset: offsetNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/earthquakes/latest
 * Get the latest earthquake
 */
router.get("/latest", async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: "Database not configured",
      });
    }

    const { data, error } = await supabase
      .from("earthquakes")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: "No earthquakes found",
        });
      }
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/earthquakes/nearby
 * Get earthquakes within a radius of coordinates
 */
router.get("/nearby", async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: "Database not configured",
      });
    }

    const { lat, lng, radius = "100" } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude are required",
      });
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string);

    // Get all earthquakes
    const { data: allEarthquakes, error } = await supabase
      .from("earthquakes")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Filter by distance
    const nearbyEarthquakes = (allEarthquakes || [])
      .map((eq) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          eq.latitude,
          eq.longitude
        );
        return {
          ...eq,
          distance: Math.round(distance * 10) / 10,
        };
      })
      .filter((eq) => eq.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: nearbyEarthquakes,
      userLocation: {
        latitude: userLat,
        longitude: userLng,
      },
      radius: radiusKm,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/earthquakes/stats
 * Get earthquake statistics
 */
router.get("/stats", async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: "Database not configured",
      });
    }

    // Get total count
    const { count: total } = await supabase
      .from("earthquakes")
      .select("*", { count: "exact", head: true });

    // Get strongest earthquake
    const { data: strongest } = await supabase
      .from("earthquakes")
      .select("*")
      .order("magnitude", { ascending: false })
      .limit(1)
      .single();

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const { count: todayCount } = await supabase
      .from("earthquakes")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", todayTimestamp);

    // Get all earthquakes for magnitude grouping
    const { data: allEarthquakes } = await supabase
      .from("earthquakes")
      .select("magnitude");

    // Group by magnitude ranges
    const byMagnitude = [
      { range: "<5", count: 0 },
      { range: "5-6", count: 0 },
      { range: "6-7", count: 0 },
      { range: "7+", count: 0 },
    ];

    (allEarthquakes || []).forEach((eq) => {
      if (eq.magnitude < 5) byMagnitude[0].count++;
      else if (eq.magnitude >= 5 && eq.magnitude < 6) byMagnitude[1].count++;
      else if (eq.magnitude >= 6 && eq.magnitude < 7) byMagnitude[2].count++;
      else byMagnitude[3].count++;
    });

    res.json({
      success: true,
      data: {
        total: total || 0,
        todayCount: todayCount || 0,
        strongest,
        byMagnitude,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/earthquakes/:id
 * Get a specific earthquake by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: "Database not configured",
      });
    }

    const { id } = req.params;

    const { data, error } = await supabase
      .from("earthquakes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: "Earthquake not found",
        });
      }
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
