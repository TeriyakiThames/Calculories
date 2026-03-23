import { loadMessages } from "@/lib/internationalisation/i18n";
import HomeClient from "@/components/Home/HomeClient";
import { Locale } from "@calculories/shared-types";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const homeMessages = await loadMessages(
    locale,
    ["TopBar", "Streak", "CalorieGoals", "SmartPicks", "SearchBar"],
    "Home",
  );

  const sharedMessages = await loadMessages(
    locale,
    ["AuthButton", "DeleteAccountButton"],
    "Shared",
  );

  const allMessages = { ...sharedMessages, ...homeMessages };

  return <HomeClient locale={locale} messages={allMessages} />;
}
