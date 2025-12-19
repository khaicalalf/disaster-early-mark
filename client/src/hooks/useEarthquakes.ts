import { useState, useEffect, useCallback } from "react";
import type { Earthquake, TimeFilter } from "../types/earthquake";
import { fetchEarthquakes, fetchNearbyEarthquakes } from "../services/api";
import { getUserLocation } from "../services/geolocation";
import { sendEarthquakeNotification } from "../services/notification";

function getTimeFilterTimestamp(filter: TimeFilter): number {
  const now = Date.now();
  switch (filter) {
    case "realtime":
      return 0; // No filter, show all
    case "today": {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today.getTime();
    }
    case "1month":
      return now - 30 * 24 * 60 * 60 * 1000;
    case "3months":
      return now - 90 * 24 * 60 * 60 * 1000;
    case "6months":
      return now - 180 * 24 * 60 * 60 * 1000;
    case "1year":
      return now - 365 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

export function useEarthquakes(timeFilter: TimeFilter = "realtime") {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadEarthquakes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userLocation = getUserLocation();
      let data: Earthquake[];

      if (userLocation) {
        // Use user's saved radius for nearby search
        data = await fetchNearbyEarthquakes(
          userLocation.latitude,
          userLocation.longitude,
          userLocation.radius // Use the actual user's radius, not hardcoded 2000
        );
      } else {
        // Fetch all earthquakes - show all Indonesia data by default
        data = await fetchEarthquakes({ limit: 200 });
      }

      // Apply time filter
      const filterTimestamp = getTimeFilterTimestamp(timeFilter);
      if (filterTimestamp > 0) {
        data = data.filter((eq) => eq.timestamp >= filterTimestamp);
      }

      // Check for new earthquakes and send notifications
      if (earthquakes.length > 0 && userLocation) {
        const newEarthquakes = data.filter(
          (eq) => !earthquakes.find((existing) => existing.id === eq.id)
        );

        newEarthquakes.forEach((eq) => {
          // Only notify for significant earthquakes (M >= 4.0) within user's actual radius
          if (
            eq.magnitude >= 4.0 &&
            eq.distance &&
            eq.distance <= userLocation.radius
          ) {
            sendEarthquakeNotification(eq);
          }
        });
      }

      setEarthquakes(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [timeFilter, earthquakes]);

  // Initial load
  useEffect(() => {
    loadEarthquakes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  // Auto-refresh every 5 minutes for realtime
  useEffect(() => {
    if (timeFilter === "realtime") {
      const interval = setInterval(() => {
        loadEarthquakes();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [loadEarthquakes, timeFilter]);

  return {
    earthquakes,
    loading,
    error,
    lastUpdate,
    refresh: loadEarthquakes,
  };
}
