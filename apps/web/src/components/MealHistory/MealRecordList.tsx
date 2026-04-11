import {
  Locale,
  MealRecord,
  Messages,
  ViewBy,
} from "@calculories/shared-types";
import MealRecordCard from "./MealRecordCard";
import { locales } from "zod";
import { t } from "@/lib/internationalisation/i18n-helpers";

interface MealRecordListProps {
  locale: Locale;
  messages: Messages;
  mealRecords: MealRecord[];
  isLoading?: boolean;
  view: ViewBy;
}

function sortRecords(records: MealRecord[]) {
  const tempRecords = records.sort((a, b) =>
    new Date(a.at) > new Date(b.at) ? -1 : 1,
  );

  const recordsSortedByDate: Map<string, MealRecord[]> = new Map<
    string,
    MealRecord[]
  >();

  for (const r of tempRecords) {
    const date = new Date(r.at).toLocaleDateString();
    // console.log(date, r.at, recordsSortedByDate.has(date));
    if (recordsSortedByDate.has(date)) {
      const records = recordsSortedByDate.get(date);
      records!.push(r);
      recordsSortedByDate.set(date, records!);
      // console.log(recordsSortedByDate.get(date));
    } else {
      recordsSortedByDate.set(date, [r]);
    }
  }

  return recordsSortedByDate;
}

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

function sumValues(date: string, records: MealRecord[], view: ViewBy) {
  let sum = 0;
  switch (view) {
    case "Calories":
      sum = records
        .entries()
        .reduce((acc, [_, { total_calorie, ...r }]) => acc + total_calorie, 0);
      break;

    case "Protein":
      sum = records
        .entries()
        .reduce((acc, [_, { total_protein, ...r }]) => acc + total_protein, 0);
      break;

    case "Carbohydrate":
      sum = records
        .entries()
        .reduce((acc, [_, { total_carbs, ...r }]) => acc + total_carbs, 0);
      break;

    case "Fat":
      sum = records
        .entries()
        .reduce((acc, [_, { total_fat, ...r }]) => acc + total_fat, 0);
      break;

    default:
      break;
  }

  return Number(sum.toFixed(0)).toLocaleString("en-US");
}

export default function MealRecordList({
  locale,
  messages,
  mealRecords,
  isLoading,
  view,
}: MealRecordListProps) {
  function formatDate(date: string) {
    const today = new Date().toLocaleDateString();
    const y = new Date();
    y.setDate(new Date().getDate() - 1);
    const yesterday = y.toLocaleDateString();

    if (date === today) return t("today", messages);
    if (date === yesterday) return t("yesterday", messages);
    return new Date(date).toLocaleDateString(
      locale === "en" ? "en-UK" : "th-TH",
      options,
    );
  }

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (!mealRecords || mealRecords.length == 0) {
    return <p>No records yet. Try adding one?</p>;
  }

  const sortedMealRecords = sortRecords(mealRecords);

  console.log("aaa", sortedMealRecords);
  console.log("b", Object.entries(sortedMealRecords));

  return (
    <div className="flex flex-col gap-8">
      {sortedMealRecords.entries().map(([date, records], index) => (
        <div key={date}>
          <div className="flex justify-between">
            {" "}
            <h2 className="font-bold">{formatDate(date)}</h2>
            <p>
              {sumValues(date, records, view)}{" "}
              {view == "Calories" ? "kcal" : "g"}
            </p>
          </div>
          {records.map((record: MealRecord) => (
            <MealRecordCard
              locale={locale}
              record={record}
              key={record.id}
              messages={messages}
              view={view}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
