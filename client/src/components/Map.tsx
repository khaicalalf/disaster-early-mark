/* eslint-disable react-hooks/purity */
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Earthquake } from "../types/earthquake";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface MapProps {
  earthquakes: Earthquake[];
  userLocation?: { latitude: number; longitude: number } | null;
  selectedEarthquake?: Earthquake | null;
  onEarthquakeClick?: (earthquake: Earthquake) => void;
}

// Component to handle map centering
function MapController({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Get color based on magnitude
function getMagnitudeColor(magnitude: number): string {
  if (magnitude < 5) return "#22c55e"; // green
  if (magnitude < 6) return "#eab308"; // yellow
  if (magnitude < 7) return "#f97316"; // orange
  return "#ef4444"; // red
}

// Get radius based on magnitude
function getMagnitudeRadius(magnitude: number): number {
  return Math.max(magnitude * 3, 8);
}

export function Map({
  earthquakes,
  userLocation,
  selectedEarthquake,
  onEarthquakeClick,
}: MapProps) {
  const indonesiaCenter: LatLngExpression = [-2.5, 118.0]; // Center of Indonesia
  const center = selectedEarthquake
    ? ([
        selectedEarthquake.latitude,
        selectedEarthquake.longitude,
      ] as LatLngExpression)
    : indonesiaCenter;

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedEarthquake && <MapController center={center} />}

      {/* User location marker */}
      {userLocation && (
        <CircleMarker
          center={[userLocation.latitude, userLocation.longitude]}
          radius={8}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>Lokasi Anda</strong>
            </div>
          </Popup>
        </CircleMarker>
      )}

      {/* Earthquake markers */}
      {earthquakes.map((earthquake) => {
        const isRecent = Date.now() - earthquake.timestamp < 3600000; // Less than 1 hour

        return (
          <CircleMarker
            key={earthquake.id}
            center={[earthquake.latitude, earthquake.longitude]}
            radius={getMagnitudeRadius(earthquake.magnitude)}
            pathOptions={{
              color: getMagnitudeColor(earthquake.magnitude),
              fillColor: getMagnitudeColor(earthquake.magnitude),
              fillOpacity: 0.6,
              weight: 2,
              className: isRecent ? "pulse-marker" : "",
            }}
            eventHandlers={{
              click: () => onEarthquakeClick?.(earthquake),
            }}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <div className="font-bold text-base">
                  M{earthquake.magnitude} - {earthquake.region}
                </div>
                <div className="text-gray-600">
                  Kedalaman: {earthquake.depth}km
                </div>
                <div className="text-gray-600">{earthquake.datetime}</div>
                {earthquake.distance && (
                  <div className="text-blue-600 font-medium">
                    📍 {earthquake.distance}km dari Anda
                  </div>
                )}
                {earthquake.tsunami_potential && (
                  <div className="text-red-600 font-bold">
                    ⚠️ {earthquake.tsunami_potential}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
