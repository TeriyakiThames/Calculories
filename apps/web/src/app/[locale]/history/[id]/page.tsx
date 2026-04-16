import { Locale } from "@calculories/shared-types";
import MealRecordDetailsClient from "@/components/MealRecordDetails/MealRecordDetailsClient";
import { loadMessages } from "@/lib/internationalisation/i18n";

interface MealRecordDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function MealRecordDetailPage(
  props: MealRecordDetailPageProps,
) {
  const { locale, id } = await props.params;

  const mealId = parseInt(id, 10);

  const messages = await loadMessages(locale, ["MealRecord"], "MealRecord");
  const mealDetailMessages = await loadMessages(
    locale,
    ["MealDetail"],
    "MealDetail",
  );
  const allMessages = { ...messages, ...mealDetailMessages };
  return (
    <main className="relative pb-28">
      <MealRecordDetailsClient
        locale={locale}
        id={mealId}
        messages={allMessages}
      />
    </main>
  );
}
