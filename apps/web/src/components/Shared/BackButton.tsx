"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  hasBg?: boolean;
  containerClassName?: string;
  href?: string;
}

export default function BackButton({
  hasBg = false,
  containerClassName,
  href,
}: BackButtonProps) {
  const router = useRouter();

  const handleNavigation = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <div className={containerClassName}>
      <button
        onClick={handleNavigation}
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
