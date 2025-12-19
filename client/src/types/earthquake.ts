export type TimeFilter =
  | "realtime"
  | "today"
  | "1month"
  | "3months"
  | "6months"
  | "1year";

export interface Earthquake {
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
  distance?: number; // Distance from user location (km)
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  radius: number; // Alert radius in km
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface EarthquakesResponse {
  success: boolean;
  data: Earthquake[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface NearbyResponse {
  success: boolean;
  data: Earthquake[];
  userLocation: {
    latitude: number;
    longitude: number;
  };
  radius: number;
}
