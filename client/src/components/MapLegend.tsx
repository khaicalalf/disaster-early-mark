export function MapLegend() {
  return (
    <div className="fixed bottom-24 right-6 z-30">
      <div className="card bg-base-100 shadow-xl border border-base-300 w-48">
        <div className="card-body p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>Skala Magnitude</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-success"></div>
              <span className="opacity-80">M &lt; 5.0 (Ringan)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-warning"></div>
              <span className="opacity-80">M 5.0-5.9 (Sedang)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#f97316" }}
              ></div>
              <span className="opacity-80">M 6.0-6.9 (Kuat)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-error pulse-marker"></div>
              <span className="opacity-80">M ≥ 7.0 (Sangat Kuat)</span>
            </div>
            <div className="divider my-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span className="opacity-80">Lokasi Anda</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
