export function Tag({
  color,
  text,
  hasIcon,
}: {
  color: "green" | "red";
  text: string;
  hasIcon?: boolean;
}) {
  const styles = {
    green: "border-green-100 text-green-100 bg-green-1",
    red: "border-red-100 text-red-100 bg-red-1",
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs leading-none hover:cursor-pointer ${styles[color]}`}
    >
      <span className="whitespace-nowrap">{text}</span>
      {hasIcon && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="6.66667"
            stroke="currentColor"
            strokeWidth="1.33333"
          />
          <path
            d="M8 10.6667V8"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
          />
          <circle cx="8" cy="5.33301" r="0.666667" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
