import { ReactNode } from "react";
import { notFound } from "next/navigation";
import "@/styles/globals.css";

const locales = ["en", "th"] as const;
export const dynamicParams = false;

// Generates all valid locale route parameters at build time.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Root layout for locale-based routing.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  return (
    // Sets the HTML `lang` attribute based on the locale
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
