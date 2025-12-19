import type { UserLocation } from "../types/earthquake";

const LOCATION_KEY = "user_location";

export async function requestGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export function saveUserLocation(location: UserLocation): void {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

export function clearUserLocation(): void {
  localStorage.removeItem(LOCATION_KEY);
}

export function getUserLocation(): UserLocation | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
