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

function sumValuesWithUnit(
  date: string,
  records: MealRecord[],
  view: ViewBy,
  messages: Messages,
) {
  let sum = 0;
  let unit_front = "g";
  let unit_back = "g";
  switch (view) {
    case "Calories":
      sum = records
        .entries()
        .reduce((acc, [_, { total_calorie, ...r }]) => acc + total_calorie, 0);
      unit_front = "";
      unit_back = "kcal";
      break;

    case "Protein":
      sum = records
        .entries()
        .reduce((acc, [_, { total_protein, ...r }]) => acc + total_protein, 0);
      unit_front += "_protein_front";
      unit_back += "_protein_back";
      break;

    case "Carbohydrate":
      sum = records
        .entries()
        .reduce((acc, [_, { total_carbs, ...r }]) => acc + total_carbs, 0);
      unit_front += "_carb_front";
      unit_back += "_carb_back";
      break;

    case "Fat":
      sum = records
        .entries()
        .reduce((acc, [_, { total_fat, ...r }]) => acc + total_fat, 0);
      unit_front += "_fat_front";
      unit_back += "_fat_back";
      break;

    default:
      break;
  }

  return (
    t(unit_front, messages) +
    " " +
    Number(sum.toFixed(0)).toLocaleString("en-US") +
    " " +
    t(unit_back, messages)
  );
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
        <p>{t("no_records", messages)}</p>
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
    const today = new Date().toLocaleDateString("en-US");
    const y = new Date();
    y.setDate(new Date().getDate() - 1);
    const yesterday = y.toLocaleDateString("en-US");

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
    <div className="flex flex-col gap-6">
      {Array.from(sortedMealRecords.entries()).map(([date, records]) => {
        return (
          <div key={date} className="flex flex-col gap-3">
            <div className="flex justify-between py-2">
              <div className="animate-collapsible-down flex gap-2">
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isEditing ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                >
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
                </div>

                <h2 className="font-bold">{formatDate(date)}</h2>
              </div>
              <p>{sumValuesWithUnit(date, records, view, messages)} </p>
            </div>
            <div className="flex flex-col gap-4">
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
          </div>
        );
      })}
    </div>
  );
}
