interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  unit: string;
  fillColor: string;
  trackColor: string;
  isMain?: boolean;
}

export default function ProgressBar({
  label,
  current,
  max,
  unit,
  fillColor,
  trackColor,
  isMain = false,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const progressPercentage = Math.min((current / safeMax) * 100, 100);

  return (
    <div className={`${isMain ? "mb-5" : "mb-3"}`}>
      <span className="flex justify-between">
        <h1
          className={`font-bold text-[#1a1a1a] ${isMain ? "text-base" : "text-xs"}`}
        >
          {label}
        </h1>
        <p className={`text-[#bfbfbf] ${isMain ? "text-sm" : "text-xs"}`}>
          <span className="font-bold">
            {current} {unit}
          </span>
          {isMain ? ` / ${max} ${unit}` : ` / ${max} ${unit}`}
        </p>
      </span>

      <div
        className={`mt-2 w-full overflow-hidden rounded-lg ${trackColor} ${isMain ? "h-2.5" : "h-1.5"}`}
      >
        <div
          className={`h-full rounded-lg transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
