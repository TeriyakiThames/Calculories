"use client";

import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@calculories/shared-types";

type LocaleSwitcherProps = {
  locale: Locale;
  className?: string;
};

const LOCALES = [
  { code: "en", label: "English" },
  { code: "th", label: "ภาษาไทย" },
] as const;

export default function LocaleSwitcher({
  locale,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pathWithoutLocale = pathname.replace(/^\/(en|th)/, "");

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className={`flex flex-col space-y-2 ${className || ""}`}>
      {LOCALES.map(({ code, label }) => {
        const isActive = locale === code;

        return (
          <label
            key={code}
            className="group flex w-full cursor-pointer items-center justify-between py-3"
          >
            <span
              className={`text-xl ${
                isActive ? "text-grey-100 font-medium" : "text-grey-60"
              }`}
            >
              {label}
            </span>

            <input
              type="radio"
              name="locale-switcher"
              value={code}
              checked={isActive}
              onChange={() => handleLocaleChange(code)}
              className="sr-only"
              aria-label={`Switch language to ${label}`}
            />

            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border-[3px] transition-colors ${
                isActive
                  ? "border-green-100"
                  : "border-grey-60 group-hover:border-grey-60"
              }`}
            >
              {isActive && (
                <div className="h-3 w-3 rounded-full bg-green-100" />
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
