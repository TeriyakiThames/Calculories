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
    if (Object.keys(checkedList).length !== 0) {
      await deleteMealRecords({
        ids: Object.keys(checkedList)
          .filter((key) => checkedList[Number(key)])
          .map(Number),
      });
      setCheckedList({});
      refreshMeal();
    }
  };

  const mealRecords: MealRecord[] = data?.data;

  return (
    <div className="flex flex-col gap-5 px-7 py-5">
      {/* Header */}
      <div className="text-grey-100 flex items-center justify-between">
        {isEditing ? (
          <button
            className="hover:bg-grey-10 rounded-xl p-2 hover:cursor-pointer"
            onClick={() => {
              setIsEditing(false);
              setCheckedList({}); // reset checkboxes
            }}
          >
            Cancel
          </button>
        ) : (
          <BackButton />
        )}
        <h1 className="pb-1 text-xl font-bold">Meal History</h1>
        {isEditing ? (
          <button
            className={`hover:bg-grey-10 disabled:text-grey-40 rounded-xl p-2 text-red-100 transition-all ${Object.keys(checkedList).every((r) => !checkedList[+r]) ?? "hover:cursor-pointer"}`}
            onClick={() => setShowPopup(true)}
            disabled={Object.keys(checkedList).every((r) => !checkedList[+r])}
          >
            Delete
          </button>
        ) : (
          <button
            className="hover:bg-grey-10 rounded-xl p-2"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
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

      {/* Popup */}
      {showPopup && (
        <Popup>
          <p className="text-grey-80 mb-2 leading-tight font-bold">
            Are you sure you want to delete these meal record(s)?
          </p>

          <div className="flex w-full gap-2">
            <button
              onClick={() => setShowPopup(false)}
              className="w-full rounded-2xl border border-red-100 py-3 font-bold text-red-100 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete()}
              className="w-full rounded-2xl bg-red-100 py-3 font-bold text-white hover:cursor-pointer"
            >
              Delete
            </button>
          </div>
        </Popup>
      )}
      <NavBar />
    </div>
  );
}
