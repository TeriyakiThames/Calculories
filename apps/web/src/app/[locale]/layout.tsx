import { ReactNode } from "react";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import { Locale } from "@/components/Shared/LocaleSwitcher";

const locales = ["en", "th"] as const;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  return (
    <html lang={locale} className="bg-[#3A3A3A]">
      <body className="bg-background relative mx-auto min-h-screen max-w-97.5 shadow-2xl">
        {children}
      </body>
    </html>
  );
}
