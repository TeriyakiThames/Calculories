import { ReactNode } from "react";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import { Locale } from "@calculories/shared-types";
import PageBottom from "@/components/Shared/PageBottom";
import { Noto_Sans_Thai } from "next/font/google";

const locales = ["en", "th"] as const;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
});

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
    <html lang={locale} className={`bg-[#3A3A3A] ${notoSansThai.className}`}>
      <body className="bg-background-10 text-grey-100 relative mx-auto min-h-screen max-w-105 shadow-2xl">
        {children}
        <PageBottom />
      </body>
    </html>
  );
}
