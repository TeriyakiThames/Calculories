import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";
import ProfileClient from "@/app/[locale]/settings/profile/ProfileClient";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");
  const setupMessages = await loadMessages(locale, ["SetupForm"], "Setup");

  return <ProfileClient messages={{ ...settingsMessages, ...setupMessages }} />;
}
