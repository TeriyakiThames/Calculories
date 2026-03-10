"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Locale = "en" | "th";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  // Remove current locale from path
  const pathWithoutLocale = pathname.replace(/^\/(en|th)/, "");

  return (
    <nav style={{ display: "flex", gap: 12 }}>
      <Link
        href={`/en${pathWithoutLocale}`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </Link>

      <Link
        href={`/th${pathWithoutLocale}`}
        aria-current={locale === "th" ? "true" : undefined}
      >
        TH
      </Link>
    </nav>
  );
}
