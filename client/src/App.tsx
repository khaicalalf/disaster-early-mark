/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Map } from "./components/Map";
import { Sidebar } from "./components/Sidebar";
import { LocationSetup } from "./components/LocationSetup";
import { LocationSettings } from "./components/LocationSettings";
import { NotificationPrompt } from "./components/NotificationPrompt";
import { TimeFilter } from "./components/TimeFilter";
import { MapLegend } from "./components/MapLegend";
import { useEarthquakes } from "./hooks/useEarthquakes";
import { useNotifications } from "./hooks/useNotifications";
import { getUserLocation } from "./services/geolocation";
import { sendTestNotification } from "./services/notification";
import type {
  Earthquake,
  UserLocation,
  TimeFilter as TimeFilterType,
} from "./types/earthquake";
import "./styles/index.css";

function App() {
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEarthquake, setSelectedEarthquake] =
    useState<Earthquake | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("realtime");

  const { earthquakes, loading, error, lastUpdate, refresh } =
    useEarthquakes(timeFilter);
  const { requestPermission, isDefault } = useNotifications();

  // Check if location is set on mount
  useEffect(() => {
    const location = getUserLocation();
    if (location) {
      setUserLocation(location);
    } else {
      setShowLocationSetup(true);
    }
  }, []);

  // Show notification prompt after location is set
  useEffect(() => {
    if (userLocation && isDefault) {
      setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 2000);
    }
  }, [userLocation, isDefault]);

  const handleLocationComplete = (location: UserLocation) => {
    setUserLocation(location);
    setShowLocationSetup(false);
    refresh();
  };

  const handleLocationUpdate = (location: UserLocation | null) => {
    setUserLocation(location);
    refresh();
  };

  const handleLocationSkip = () => {
    setShowLocationSetup(false);
  };

  const handleEnableNotifications = async () => {
    await requestPermission();
    setShowNotificationPrompt(false);
  };

  const handleEarthquakeClick = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
    setSidebarOpen(false);
  };

  const handleTimeFilterChange = (filter: TimeFilterType) => {
    setTimeFilter(filter);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-base-200">
      {/* Map */}
      <div id="map" className="absolute inset-0">
        {loading && earthquakes.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="card bg-base-100 shadow-2xl p-8 max-w-sm">
              <div className="text-center space-y-4">
                <div className="relative">
                  <span className="loading loading-ring loading-lg text-primary"></span>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    🌍
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-lg">Memuat data gempa...</p>
                  <p className="text-sm opacity-70 mt-2">
                    Mengambil data dari BMKG
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-error/10 to-warning/10">
            <div className="card bg-base-100 shadow-2xl p-8 max-w-md mx-4">
              <div className="text-center space-y-4">
                <div className="text-error text-6xl">⚠️</div>
                <div>
                  <h2 className="text-2xl font-bold">Terjadi Kesalahan</h2>
                  <p className="opacity-70 mt-2">{error}</p>
                </div>
                <button onClick={refresh} className="btn btn-primary">
                  🔄 Coba Lagi
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Map
            earthquakes={earthquakes}
            userLocation={userLocation}
            selectedEarthquake={selectedEarthquake}
            onEarthquakeClick={handleEarthquakeClick}
          />
        )}
      </div>

      {/* Time Filter */}
      {!showLocationSetup && !loading && !error && (
        <TimeFilter
          selectedFilter={timeFilter}
          onFilterChange={handleTimeFilterChange}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        earthquakes={earthquakes}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onEarthquakeClick={handleEarthquakeClick}
        lastUpdate={lastUpdate}
      />

      {/* Map Legend */}
      {!showLocationSetup && !loading && !error && <MapLegend />}

      {/* Settings Menu Button */}
      <div className="dropdown dropdown-top dropdown-end fixed bottom-6 right-24 z-30">
        <button
          tabIndex={0}
          className="btn btn-circle btn-lg shadow-xl"
          title="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 mb-2"
        >
          <li>
            <button onClick={() => setShowLocationSettings(true)}>
              <svg
                className="w-5 h-5"
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
              Pengaturan Lokasi
            </button>
          </li>
          <li>
            <button onClick={handleEnableNotifications}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Aktifkan Notifikasi
            </button>
          </li>
          <li>
            <button onClick={sendTestNotification}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Test Notifikasi
            </button>
          </li>
          <div className="divider my-0"></div>
          <li>
            <a
              href="https://www.bmkg.go.id"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tentang BMKG
            </a>
          </li>
        </ul>
      </div>

      {/* Refresh button */}
      <button
        onClick={refresh}
        className="btn btn-circle btn-lg fixed bottom-6 right-6 z-30 shadow-xl"
        title="Refresh data"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Location setup modal */}
      {showLocationSetup && (
        <LocationSetup
          onComplete={handleLocationComplete}
          onSkip={handleLocationSkip}
        />
      )}

      {/* Location settings modal */}
      <LocationSettings
        isOpen={showLocationSettings}
        onClose={() => setShowLocationSettings(false)}
        onLocationUpdate={handleLocationUpdate}
      />

      {/* Notification prompt */}
      {showNotificationPrompt && !showLocationSetup && (
        <NotificationPrompt
          onEnable={handleEnableNotifications}
          onDismiss={() => setShowNotificationPrompt(false)}
        />
      )}

      {/* Attribution */}
      <div className="badge badge-lg fixed bottom-6 left-6 z-30 shadow-lg bg-base-100">
        Data: <strong className="ml-1">BMKG Indonesia</strong>
      </div>
    </div>
  );
}

export default App;
