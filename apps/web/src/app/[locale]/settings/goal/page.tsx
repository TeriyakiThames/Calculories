import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";
import GoalClient from "./GoalClient";

export default async function Goal({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");
  const setupMessages = await loadMessages(locale, ["SetupForm"], "Setup");

  return (
    <GoalClient
      locale={locale}
      messages={{ ...settingsMessages, ...setupMessages }}
    />
  );
}
