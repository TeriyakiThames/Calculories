import { ReactNode } from "react";

export default function Popup({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-80 flex-col items-center gap-2.5 rounded-2xl bg-white p-6 text-center shadow-xl">
        {children}
      </div>
    </div>
  );
}
