"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  hasBg?: boolean;
  containerClassName?: string;
}

export default function BackButton({
  hasBg = false,
  containerClassName,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <div className={containerClassName}>
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className={`${hasBg ? "bg-white" : ""} hover:bg-grey-10 flex h-9 w-9 flex-col items-center justify-center gap-2.5 rounded-full p-2.5 transition-all`}
      >
        <Image
          src={"/Icons/Arrow.svg"}
          width={16}
          height={16}
          alt="Back button"
          priority
        />
      </button>
    </div>
  );
}
