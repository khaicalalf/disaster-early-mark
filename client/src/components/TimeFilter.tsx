import type { TimeFilter } from "../types/earthquake";

interface TimeFilterProps {
  selectedFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

const filterOptions: { value: TimeFilter; label: string; icon: string }[] = [
  { value: "realtime", label: "Real Time", icon: "⚡" },
  { value: "today", label: "Hari Ini", icon: "📅" },
  { value: "1month", label: "1 Bulan", icon: "📊" },
  { value: "3months", label: "3 Bulan", icon: "📈" },
  { value: "6months", label: "6 Bulan", icon: "📉" },
  { value: "1year", label: "1 Tahun", icon: "📆" },
];

export function TimeFilter({
  selectedFilter,
  onFilterChange,
}: TimeFilterProps) {
  return (
    <div className="flex items-center justify-center fixed top-6 left-1/2 -translate-x-1/2 z-40 w-1/2 mx-4 animate-fade-in">
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body p-2">
          <div className="btn-group">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`btn btn-sm ${
                  selectedFilter === option.value
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
