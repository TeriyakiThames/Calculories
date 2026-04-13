import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";
import DietaryClient from "@/app/[locale]/settings/dietary-restrictions/DietaryClient";

export default async function DietaryRestrictionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");
  const setupMessages = await loadMessages(locale, ["SetupForm"], "Setup");

  return (
    <DietaryClient
      locale={locale}
      messages={{ ...settingsMessages, ...setupMessages }}
    />
  );
}
