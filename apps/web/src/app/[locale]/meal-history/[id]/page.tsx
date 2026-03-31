import { Locale } from "@calculories/shared-types";
import { notFound } from "next/navigation";
import getMealRecord from "@/services/api/getMealRecord";

interface MealRecordDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function MealRecordDetailPage(
  props: MealRecordDetailPageProps,
) {
  const { id } = await props.params;
  const mealId = parseInt(id, 10);
  let mealRecord: unknown;

  try {
    mealRecord = await getMealRecord(mealId);
  } catch {
    notFound();
  }

  return (
    <main className="relative pb-28">
      <p>{JSON.stringify(mealRecord)}</p>
    </main>
  );
}
