import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";
import SettingsClient from "@/app/[locale]/settings/SettingsClient";

export default async function Settings({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");
  const sharedMessages = await loadMessages(
    locale,
    ["AuthButton", "DeleteAccountButton", "NavBar"],
    "Shared",
  );
  const allMessages = { ...settingsMessages, ...sharedMessages };

  return <SettingsClient locale={locale} messages={allMessages} />;
}
