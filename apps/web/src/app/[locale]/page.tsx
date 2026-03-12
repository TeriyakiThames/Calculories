import { loadMessages } from "@/lib/internationalisation/i18n";
import HomeClient from "../../components/Home/HomeClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: "en" | "th" }>;
}) {
  const { locale } = await params;

  const homeMessages = loadMessages(
    locale,
    ["TopBar", "Streak", "CalorieGoals", "SmartPicks", "SearchBar"],
    "Home",
  );

  const sharedMessages = loadMessages(locale, ["AuthButton", "DeleteAccountButton"], "Shared");

  const allMessages = { ...sharedMessages, ...homeMessages };

  return <HomeClient locale={locale} messages={allMessages} />;
}
