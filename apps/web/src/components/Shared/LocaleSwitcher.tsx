"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export type Locale = "en" | "th";

export type LocaleSwitcherProps = {
  locale: "en" | "th";
  className?: string;
};

export default function LocaleSwitcher({
  locale,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(en|th)/, "");
  const targetLocale = locale === "en" ? "th" : "en";
  const displayIcon =
    locale === "en"
      ? "/Icons/LocaleSwitcher/EN.svg"
      : "/Icons/LocaleSwitcher/TH.svg";

  return (
    <Link href={`/${targetLocale}${pathWithoutLocale}`} className={className}>
      <Image
        src={displayIcon}
        width={58}
        height={32}
        alt={`Switch to ${targetLocale.toUpperCase()}`}
        priority
      />
    </Link>
  );
}
