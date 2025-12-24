import { useState } from "react";
import {
  getUserLocation,
  saveUserLocation,
  clearUserLocation,
  requestGeolocation,
} from "../services/geolocation";
import type { UserLocation } from "../types/earthquake";

interface LocationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationUpdate: (location: UserLocation | null) => void;
}

export function LocationSettings({
  isOpen,
  onClose,
  onLocationUpdate,
}: LocationSettingsProps) {
  const currentLocation = getUserLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(
    currentLocation?.latitude.toString() || ""
  );
  const [longitude, setLongitude] = useState(
    currentLocation?.longitude.toString() || ""
  );
  const [radius, setRadius] = useState(currentLocation?.radius || 100);

  const handleUseMyLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const position = await requestGeolocation();
      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mendapatkan lokasi Anda"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearLocation = () => {
    clearUserLocation();
    onLocationUpdate(null);
    onClose();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Koordinat tidak valid");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Koordinat di luar jangkauan");
      return;
    }

    const location: UserLocation = {
      latitude: lat,
      longitude: lng,
      radius,
    };

    saveUserLocation(location);
    onLocationUpdate(location);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl">⚙️ Pengaturan Lokasi</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-outline"
            >
              ✕
            </button>
          </div>

          {currentLocation ? (
            <div className="alert alert-info mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="text-sm">
                <div className="font-semibold">Lokasi Saat Ini:</div>
                <div className="opacity-80">
                  {currentLocation.latitude.toFixed(4)},{" "}
                  {currentLocation.longitude.toFixed(4)}
                  <br />
                  Radius: {currentLocation.radius}km
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="text-sm">
                <div className="font-semibold">Lokasi Belum Diatur</div>
                <div className="opacity-80">
                  Menampilkan semua gempa di Indonesia
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Latitude</span>
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-6.2088 (Jakarta)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Longitude</span>
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="106.8456 (Jakarta)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Radius Notifikasi
                </span>
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="select select-bordered w-full"
              >
                <option value={50}>📍 50 km</option>
                <option value={100}>📍 100 km</option>
                <option value={200}>📍 200 km</option>
                <option value={500}>📍 500 km</option>
                <option value={1000}>📍 1000 km</option>
                <option value={1500}>📍 1500 km</option>
                <option value={2000}>📍 2000 km</option>
              </select>
            </div>

            <div className="divider">ATAU</div>

            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={loading}
              className="btn btn-outline btn-info w-full"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Mendapatkan lokasi...
                </>
              ) : (
                <>📍 Gunakan Lokasi Saat Ini</>
              )}
            </button>

            {currentLocation && (
              <button
                type="button"
                onClick={handleClearLocation}
                className="btn btn-outline w-full text-error"
              >
                🗑️ Hapus Lokasi (Tampilkan Semua Data)
              </button>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline flex-1"
              >
                Batal
              </button>
              <button type="submit" className="btn btn-info flex-1">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
