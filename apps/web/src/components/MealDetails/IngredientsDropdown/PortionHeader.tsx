import { useState, useRef, useEffect } from "react";

export type PortionMode = "display" | "slider" | "input";

interface PortionHeaderProps {
  portionMode: PortionMode;
  setPortionMode: (mode: PortionMode) => void;
}

export function PortionHeader({
  portionMode,
  setPortionMode,
}: PortionHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectMode = (mode: PortionMode) => {
    setPortionMode(mode);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-100 text-lg font-bold">Portions</span>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-green-10 flex items-center justify-center gap-1 rounded-sm p-1 text-sm leading-none font-bold text-green-100 italic transition-opacity hover:opacity-80"
        >
          <span>
            {portionMode === "display" ? "Adjust Portion" : "Editing..."}
          </span>
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.372 13.879C12.669 13.879 12.91 14.12 12.91 14.417C12.91 14.714 12.669 14.955 12.372 14.955H0.538086C0.240986 14.955 0 14.714 0 14.417C0 14.12 0.240986 13.879 0.538086 13.879H12.372ZM7.06836 4.36923C7.40436 5.00169 7.89936 5.79987 8.5273 6.42782C9.15525 7.05576 9.95343 7.55081 10.5864 7.88681L6.49836 11.9747C6.24436 12.2281 5.91536 12.3927 5.56036 12.4434L3.09836 12.795C2.55136 12.8732 2.08136 12.4037 2.16036 11.8565L2.51136 9.39462C2.56236 9.03972 2.72636 8.71069 2.98036 8.45712L7.06836 4.36923ZM8.90736 2.53036C9.55536 1.88309 10.6044 1.88313 11.2524 2.53036L12.4254 3.70321C13.0724 4.35068 13.0724 5.40052 12.4254 6.04794L11.3854 7.087C11.3034 7.04667 11.2184 7.00291 11.1294 6.95614C10.5304 6.6407 9.81936 6.19774 9.28836 5.66708C8.75736 5.13643 8.31436 4.42545 7.99936 3.82626C7.95236 3.73743 7.90836 3.65184 7.86836 3.5704L8.90736 2.53036Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="border-grey-10 absolute top-full right-0 z-30 mt-2 w-40 overflow-hidden rounded-lg border bg-white shadow-lg">
            <button
              onClick={() => selectMode("slider")}
              className="hover:bg-green-10 text-grey-80 w-full px-4 py-2 text-left text-sm transition-colors"
            >
              Edit by Slider
            </button>
            <button
              onClick={() => selectMode("input")}
              className="hover:bg-green-10 text-grey-80 border-grey-10 w-full border-t px-4 py-2 text-left text-sm transition-colors"
            >
              Edit by Grams
            </button>
            {portionMode !== "display" && (
              <button
                onClick={() => selectMode("display")}
                className="hover:bg-red-1 border-grey-10 w-full border-t px-4 py-2 text-left text-sm text-red-100 transition-colors"
              >
                Cancel Editing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
