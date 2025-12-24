import { useState } from "react";
import { requestGeolocation, saveUserLocation } from "../services/geolocation";
import type { UserLocation } from "../types/earthquake";

interface LocationSetupProps {
  onComplete: (location: UserLocation) => void;
  onSkip: () => void;
}

export function LocationSetup({ onComplete, onSkip }: LocationSetupProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(100);

  const handleUseMyLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const position = await requestGeolocation();
      const location: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        radius,
      };

      saveUserLocation(location);
      onComplete(location);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mendapatkan lokasi Anda"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
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
    onComplete(location);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <div className="text-center space-y-2 mb-4">
            <h2 className="card-title text-3xl justify-center">
              🌍 Selamat Datang!
            </h2>
            <p className="text-base-content/70">
              Atur lokasi Anda untuk menerima notifikasi gempa bumi di sekitar
              area Anda.
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
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

          {!manualMode ? (
            <div className="space-y-4">
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
                  <option value={100}>📍 100 km (Rekomendasi)</option>
                  <option value={200}>📍 200 km</option>
                  <option value={500}>📍 500 km</option>
                  <option value={1000}>📍 1000 km</option>
                  <option value={1500}>📍 1500 km</option>
                  <option value={2000}>📍 2000 km</option>
                </select>
              </div>

              <button
                onClick={handleUseMyLocation}
                disabled={loading}
                className="btn btn-info w-full"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Mendapatkan lokasi...
                  </>
                ) : (
                  <>📍 Gunakan Lokasi Saya</>
                )}
              </button>

              <button
                onClick={() => setManualMode(true)}
                className="btn btn-outline btn-info w-full"
              >
                ✏️ Input Manual
              </button>

              <button onClick={onSkip} className="btn btn-ghost btn-sm w-full">
                Lewati (Nanti saja)
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Latitude(-6.2088 (Jakarta))
                  </span>
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
                  <span className="label-text font-semibold">
                    Longitude(106.8456 (Jakarta))
                  </span>
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
                  <option value={100}>📍 100 km (Rekomendasi)</option>
                  <option value={200}>📍 200 km</option>
                  <option value={500}>📍 500 km</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setManualMode(false)}
                  className="btn btn-outline flex-1"
                >
                  ← Kembali
                </button>
                <button type="submit" className="btn btn-info flex-1">
                  Simpan ✓
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
