import type { Earthquake } from "../types/earthquake";

interface SidebarProps {
  earthquakes: Earthquake[];
  isOpen: boolean;
  onToggle: () => void;
  onEarthquakeClick: (earthquake: Earthquake) => void;
  lastUpdate: Date | null;
}

function getMagnitudeBadgeClass(magnitude: number): string {
  if (magnitude < 5) return "badge-success";
  if (magnitude < 6) return "badge-warning";
  if (magnitude < 7) return "badge-error";
  return "badge-error animate-pulse";
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export function Sidebar({
  earthquakes,
  isOpen,
  onToggle,
  onEarthquakeClick,
  lastUpdate,
}: SidebarProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="btn btn-circle btn-lg fixed top-6 left-6 z-60 shadow-lg btn-outline"
        title={isOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-base-100 shadow-lg border-r border-base-300 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "380px" }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-base-300 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">🌍</div>
              <h2 className="text-2xl font-bold">Gempa Terkini</h2>
            </div>
            {lastUpdate && (
              <div className="badge badge-ghost gap-2">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Update: {lastUpdate.toLocaleTimeString("id-ID")}
              </div>
            )}
          </div>

          {/* Earthquake list */}
          <div className="flex-1 overflow-y-auto">
            {earthquakes.length === 0 ? (
              <div className="p-8 text-center opacity-60">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-medium">Tidak ada data gempa</p>
              </div>
            ) : (
              <div className="divide-y divide-base-300">
                {earthquakes.map((earthquake) => (
                  <button
                    key={earthquake.id}
                    onClick={() => onEarthquakeClick(earthquake)}
                    className="w-full p-5 hover:bg-base-200 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Magnitude badge */}
                      <div
                        className={`badge badge-lg ${getMagnitudeBadgeClass(
                          earthquake.magnitude
                        )} font-bold`}
                      >
                        M{earthquake.magnitude}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {earthquake.region}
                        </div>
                        <div className="text-xs opacity-70 mt-1.5 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                            Kedalaman: {earthquake.depth}km
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {getTimeAgo(earthquake.timestamp)}
                          </div>
                        </div>
                        {earthquake.distance && (
                          <div className="badge badge-primary badge-sm mt-2 gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {earthquake.distance}km dari Anda
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-base-300 bg-base-200 text-center">
            <p className="text-xs opacity-70">
              Data: <strong>BMKG Indonesia</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
    </>
  );
}
