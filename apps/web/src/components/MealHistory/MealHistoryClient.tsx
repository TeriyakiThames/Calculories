"use client";

import BackButton from "@/components/Shared/BackButton";
import { Input } from "@/components/Shared/Input";
import useUser from "@/hooks/useUser";
import { t, Messages } from "@/lib/internationalisation/i18n-helpers";
import getMealHistory from "@/services/api/getMealHistory";
import { Locale, MealRecord, ViewBy } from "@calculories/shared-types";
import { useState } from "react";
import useSWR from "swr";
import MealRecordList from "./MealRecordList";

export default function MealHistoryClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { loading: authLoading, error: authError, user: authUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [checkedList, setCheckedList] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [view, setView] = useState("Calories");
  const [viewDisplay, setViewDisplay] = useState(t("calories", messages));

  const {
    data,
    // mutate: refreshMeal,
    isValidating: isLoadingMealRecords,
  } = useSWR(
    authUser?.id ? `meal-history-${authUser.id}` : null,
    () => getMealHistory(),
    {
      //temp for development
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      refreshInterval: 0,
    },
  );

  const mealRecords: MealRecord[] = data?.data;

  return (
    <div className="flex flex-col gap-5 px-7 py-5">
      {/* Header */}
      <div className="text-grey-100 flex items-center justify-between">
        <BackButton />
        <h1 className="pb-1 text-xl font-bold">Meal History</h1>
        <button
          className="hover:bg-grey-10 rounded-xl p-2"
          // TODO: setIsEditing(true) and has Delete button
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          Edit
        </button>
      </div>

      {/* View */}
      <div className="flex items-center justify-between gap-5 align-middle">
        <p className="w-14 font-bold">{t("view", messages)}</p>
        <div className="w-full">
          <Input
            placeholder={t("calories", messages)}
            type="dropdown"
            options={{
              Calories: t("calories", messages),
              Protein: t("protein", messages),
              Carbohydrate: t("carbohydrate", messages),
              Fat: t("fat", messages),
            }}
            value={view}
            onChange={(val) => {
              setView(val);
              // TODO
              // validateField("sex", val);
            }}
            onDropDownNameChange={(name) => setViewDisplay(name)}
            dropDownName={viewDisplay}
            // TODO
            // error={errors.sex}
          />
        </div>
      </div>

      <MealRecordList
        mealRecords={mealRecords}
        messages={messages}
        locale={locale}
        isLoading={isLoadingMealRecords}
        view={view as ViewBy}
        isEditing={isEditing}
        checkedList={checkedList}
        setCheckedList={setCheckedList}
      />
    </div>
  );
}
