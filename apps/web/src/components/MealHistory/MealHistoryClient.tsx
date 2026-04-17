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
import deleteMealRecords from "@/services/api/deleteMealRecords";
import NavBar from "../Shared/NavBar";
import Popup from "../Shared/Popup";

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
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data,
    mutate: refreshMeal,
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

  const handleDelete = async () => {
    setShowPopup(false);
    setIsDeleting(true);
    if (Object.keys(checkedList).length !== 0) {
      await deleteMealRecords({
        ids: Object.keys(checkedList)
          .filter((key) => checkedList[Number(key)])
          .map(Number),
      });
      setIsDeleting(false);
      setCheckedList({});
      refreshMeal();
    }
  };

  const mealRecords: MealRecord[] = data?.data;

  return (
    <div>
      <h1 className="absolute top-7.5 w-full text-center text-xl font-bold">
        {t("meal_history", messages)}
      </h1>
      <div className="flex flex-col gap-5 px-7 py-5.5">
        {/* Header */}
        <div className="text-grey-100 flex items-center justify-between">
          {isEditing ? (
            <button
              className="hover:bg-grey-10 z-2 rounded-xl p-2 transition-all hover:cursor-pointer"
              onClick={() => {
                setIsEditing(false);
                setCheckedList({}); // reset checkboxes
              }}
            >
              {t("cancel", messages)}
            </button>
          ) : (
            <BackButton />
          )}

          {isEditing ? (
            <button
              className={`hover:bg-grey-10 disabled:text-grey-40 z-2 rounded-xl p-2 text-red-100 transition-all ${Object.keys(checkedList).every((r) => !checkedList[+r]) ?? "hover:cursor-pointer"}`}
              onClick={() => setShowPopup(true)}
              disabled={Object.keys(checkedList).every((r) => !checkedList[+r])}
            >
              {t("delete", messages)}
            </button>
          ) : (
            <button
              className="hover:bg-grey-10 z-2 rounded-xl p-2 transition-all"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              {t("edit", messages)}
            </button>
          )}
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
              }}
              onDropDownNameChange={(name) => setViewDisplay(name)}
              dropDownName={viewDisplay}
            />
          </div>
        </div>

        <MealRecordList
          mealRecords={mealRecords}
          messages={messages}
          locale={locale}
          isLoading={isLoadingMealRecords || isDeleting}
          view={view as ViewBy}
          isEditing={isEditing}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
        />

        {/* Popup */}
        {showPopup && (
          <Popup onClickOutside={() => setShowPopup(false)}>
            <p className="text-grey-80 mb-2 leading-tight font-bold">
              {t("delete_confirm", messages)}
            </p>

            <div className="flex w-full gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full rounded-2xl border border-red-100 py-3 font-bold text-red-100 hover:cursor-pointer"
              >
                {t("cancel", messages)}
              </button>
              <button
                onClick={() => handleDelete()}
                className="w-full rounded-2xl bg-red-100 py-3 font-bold text-white hover:cursor-pointer"
              >
                {t("delete", messages)}
              </button>
            </div>
          </Popup>
        )}
        <NavBar messages={messages} />
      </div>
    </div>
  );
}
