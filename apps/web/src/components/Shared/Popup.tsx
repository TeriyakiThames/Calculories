import { ReactNode } from "react";

interface PopupProps {
  onClickOutside: () => void;
  children: ReactNode;
}

export default function Popup({ onClickOutside, children }: PopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClickOutside}></div>

      {/* Modal Content */}
      <div className="z-60 flex w-80 flex-col items-center gap-2.5 rounded-2xl bg-white p-6 text-center shadow-xl">
        {children}
      </div>
    </div>
  );
}
