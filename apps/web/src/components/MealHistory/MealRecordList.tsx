import {
  Locale,
  MealRecord,
  Messages,
  ViewBy,
} from "@calculories/shared-types";
import MealRecordCard from "./MealRecordCard";
import { t } from "@/lib/internationalisation/i18n-helpers";
import Checkbox from "../Shared/Checkbox";
import { Dispatch, SetStateAction } from "react";
import Loading from "../Shared/Loading";
import Image from "next/image";

interface MealRecordListProps {
  locale: Locale;
  messages: Messages;
  mealRecords: MealRecord[];
  isLoading?: boolean;
  view: ViewBy;
  isEditing: boolean;
  checkedList: { [key: number]: boolean };
  setCheckedList: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
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
    const date = new Date(r.at).toLocaleDateString("en-US");
    if (recordsSortedByDate.has(date)) {
      const records = recordsSortedByDate.get(date);
      records!.push(r);
      recordsSortedByDate.set(date, records!);
    } else {
      recordsSortedByDate.set(date, [r]);
    }
  }

  return recordsSortedByDate;
}

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
  isEditing,
  checkedList,
  setCheckedList,
}: MealRecordListProps) {
  if (isLoading) {
    return (
      <div className="align-center mt-40 flex w-full items-center justify-center">
        <Loading size={24} />
      </div>
    );
  }

  if (!mealRecords || mealRecords.length == 0) {
    return (
      <div className="align-center mt-40 flex w-full flex-col items-center justify-center gap-5">
        <Image
          src="/Icons/DishIcon.svg"
          alt="Toggle"
          width={100}
          height={100}
        />
        <p>No records yet. Try adding one?</p>
      </div>
    );
  }

  const sortedMealRecords = sortRecords(mealRecords);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

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

  function handleRecordCheckboxChange(isChecked: boolean, recordId: number) {
    setCheckedList((prevCheckedList) => {
      const updatedState = { ...prevCheckedList };
      updatedState[recordId] = isChecked;
      return updatedState;
    });
  }

  function handleDayCheckboxChange(isChecked: boolean, date: string) {
    setCheckedList((prevCheckedList) => {
      const updatedState = { ...prevCheckedList };
      sortedMealRecords.get(date)!.forEach((record) => {
        updatedState[record.id] = isChecked;
      });

      return updatedState;
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {Array.from(sortedMealRecords.entries()).map(([date, records]) => {
        return (
          <div key={date}>
            <div className="flex justify-between py-2">
              <div className="animate-collapsible-down flex gap-2">
                <Checkbox
                  id={formatDate(date)}
                  isChecked={
                    sortedMealRecords
                      .get(date)!
                      .every((record) => checkedList[record.id]) || false
                  }
                  isVisible={isEditing}
                  onChange={(isChecked) =>
                    handleDayCheckboxChange(isChecked, date)
                  }
                />

                <h2 className="font-bold">{formatDate(date)}</h2>
              </div>
              <p>
                {sumValues(date, records, view)}{" "}
                {view == "Calories" ? "kcal" : "g"}
              </p>
            </div>
            {records.map((record: MealRecord) => {
              const isRecordChecked = checkedList[record.id] || false;
              return (
                <MealRecordCard
                  locale={locale}
                  record={record}
                  key={record.id}
                  messages={messages}
                  view={view}
                  isChecked={isRecordChecked}
                  isEditing={isEditing}
                  onChange={(isChecked) =>
                    handleRecordCheckboxChange(isChecked, record.id)
                  }
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
