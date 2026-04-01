import { Component, Locale } from "@calculories/shared-types";
import { notFound } from "next/navigation";
import getMealRecord from "@/services/api/getMealRecord";
import DeleteMealButton from "@/components/MealRecordDetails/DeleteMealButton";

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
  let mealRecord;

  try {
    mealRecord = await getMealRecord(mealId);
  } catch {
    notFound();
  }

  return (
    <main className="relative pb-28">
      <h1>
        {mealRecord.name_th} | {mealRecord.name_en}
      </h1>
      <ul>
        {mealRecord.components.map((c: Component) => (
          <li key={c.id}>{c.name_en}</li>
        ))}
      </ul>
      <br />
      <p>{JSON.stringify(mealRecord)}</p>
      <DeleteMealButton mealId={mealId} />
    </main>
  );
}
