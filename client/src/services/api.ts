import type {
  Earthquake,
  EarthquakesResponse,
  NearbyResponse,
  ApiResponse,
} from "../types/earthquake";

//http://localhost:3000/api || https://express-test-1-virid.vercel.app/api
const API_BASE_URL = "https://express-test-1-virid.vercel.app/api";
//const API_BASE_URL = "http://localhost:3000/api";

export async function fetchEarthquakes(params?: {
  limit?: number;
  offset?: number;
  minMagnitude?: number;
  maxMagnitude?: number;
}): Promise<Earthquake[]> {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());
  if (params?.minMagnitude)
    queryParams.append("minMagnitude", params.minMagnitude.toString());
  if (params?.maxMagnitude)
    queryParams.append("maxMagnitude", params.maxMagnitude.toString());

  const response = await fetch(`${API_BASE_URL}/earthquakes?${queryParams}`);
  const data: EarthquakesResponse = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch earthquakes");
  }

  return data.data;
}

export async function fetchLatestEarthquake(): Promise<Earthquake> {
  const response = await fetch(`${API_BASE_URL}/earthquakes/latest`);
  const data: ApiResponse<Earthquake> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch latest earthquake");
  }

  return data.data;
}

export async function fetchNearbyEarthquakes(
  latitude: number,
  longitude: number,
  radius: number
): Promise<Earthquake[]> {
  const response = await fetch(
    `${API_BASE_URL}/earthquakes/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
  );
  const data: NearbyResponse = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch nearby earthquakes");
  }

  return data.data;
}

export async function fetchEarthquakeById(id: string): Promise<Earthquake> {
  const response = await fetch(`${API_BASE_URL}/earthquakes/${id}`);
  const data: ApiResponse<Earthquake> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch earthquake");
  }

  return data.data;
}
