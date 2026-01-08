interface NotificationPromptProps {
  onEnable: () => void;
  onDismiss: () => void;
}

export function NotificationPrompt({
  onEnable,
  onDismiss,
}: NotificationPromptProps) {
  return (
    <div className="fixed top-60 sm:top-40 left-1/2 -translate-x-1/2 z-40 max-w-md w-1/2 md:w-full mx-4">
      <div className="flex flex-col md:flex-row alert shadow-lg bg-base-100 border border-base-300">
        <div className="text-4xl">🔔</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Aktifkan Notifikasi Gempa</h3>
          <p className="text-sm opacity-70">
            Dapatkan peringatan langsung saat ada gempa bumi di sekitar lokasi
            Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEnable} className="btn bg-cyan-600 btn-sm">
            Aktifkan
          </button>
          <button onClick={onDismiss} className="btn btn-outline btn-sm">
            Nanti
          </button>
        </div>
      </div>
    </div>
  );
}
