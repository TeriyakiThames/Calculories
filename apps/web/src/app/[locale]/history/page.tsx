import MealHistoryClient from "@/components/MealHistory/MealHistoryClient";
import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";

export default async function MealHistoryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const messages = await loadMessages(locale, ["MealHistory"], "MealHistory");
  return <MealHistoryClient locale={locale} messages={messages} />;
}
