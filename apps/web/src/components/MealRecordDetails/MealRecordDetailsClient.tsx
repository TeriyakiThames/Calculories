"use client";

import {
  setOrUpdateMealRecordRatiosRequest,
  Dish,
  Locale,
  MealRecord,
  Messages,
} from "@calculories/shared-types";
import BackButton from "@/components/Shared/BackButton";
import Image from "next/image";
import { IngredientsDropdown } from "@/components/MealDetails/IngredientsDropdown";
import { MealHeader } from "@/components/MealDetails/MealHeader";
import { NutritionalInfo } from "@/components/MealDetails/NutritionalInfo";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import getMealRecord from "@/services/api/getMealRecord";
import HadAt from "./HadAt";
import updateMealRecord from "@/services/api/updateMealRecord";

interface MealRecordDetailsClientProps {
  locale: Locale;
  id: number;
  messages: Messages;
}

export const MealRecordDetailsClientSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-gray-100">
    {/* Image Skeleton */}
    <div className="">
      <div className="-z-10 h-84 w-full bg-gray-300" />

      {/* Back Button */}
      <div className="absolute top-3.5 left-3 z-10 h-9 w-9 rounded-full bg-gray-200" />
    </div>

    {/* Bottom Card */}
    <div className="relative z-10 -mt-11 flex flex-col gap-7.5 rounded-t-3xl bg-white p-8.75">
      <div className="flex flex-col gap-3">
        {/* Title + Price */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 rounded bg-gray-300" />
          <div className="h-6 w-16 rounded bg-gray-300" />
        </div>

        {/* Restaurant name */}
        <div className="h-4 w-32 rounded bg-gray-200" />

        {/* Restauant type */}
        <div className="h-3 w-48 rounded bg-gray-200" />

        {/* Components */}
        <div className="h-3 w-48 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-2.5">
        {/* ENERGY Card */}
        <div className="space-y-2 rounded-2xl bg-gray-100 p-3.5">
          <div className="mx-auto h-4 w-20 rounded bg-gray-300" />
          <div className="mx-auto h-6 w-16 rounded bg-gray-300" />
        </div>

        {/* Nutrition Cards */}
        <div className="flex gap-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 space-y-2 rounded-2xl bg-gray-100 p-3.5"
            >
              <div className="mx-auto h-4 w-16 rounded bg-gray-300" />
              <div className="mx-auto h-6 w-10 rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Button */}
    <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-105 border-t border-[#8e8e93] bg-[#f6f7f7] px-9 py-7">
      <div className="h-16 w-full rounded-2xl bg-gray-400" />
    </div>
  </div>
);

export default function MealRecordDetailsClient({
  locale,
  id,
  messages,
}: MealRecordDetailsClientProps) {
  const [record, setRecord] = useState<MealRecord | undefined>(undefined);
  const [date, setDate] = useState<Date>(new Date());

  const updateMealRecordRatios = async (
    data: setOrUpdateMealRecordRatiosRequest,
  ) => {
    try {
      await updateMealRecord(data, id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const tempRecord = (await getMealRecord(id)) as MealRecord;

        if (!tempRecord) return notFound();
        setRecord(tempRecord);
        setDate(new Date(tempRecord.at));
      } catch (error) {
        console.error(error);
        return notFound();
      }
    };

    fetchDish();
  }, [id]);

  useEffect(() => {
    const updateHadAt = async () => {
      try {
        await updateMealRecord({ at: date.toISOString() }, id);
      } catch (error) {
        console.error(error);
      }
    };

    updateHadAt();
  }, [date, id]);

  if (!record) return <MealRecordDetailsClientSkeleton />;

  return (
    <main className="relative pb-28">
      <BackButton
        hasBg={true}
        containerClassName="absolute top-3.5 left-3 z-10"
      />
      <Image
        src={"/Dish/MockDish.png"}
        width={420}
        height={335}
        alt="Dish image"
        priority
        className="h-auto w-full object-cover"
      />
      <div className="relative -mt-17 flex flex-col gap-7.5 rounded-t-3xl bg-white p-8.75">
        <MealHeader dish={record as unknown as Dish} locale={locale} />
        <NutritionalInfo dish={record as unknown as Dish} />
        <div className="bg-grey-40 my h-[0.5px] w-full" />
        <IngredientsDropdown
          dish={record as unknown as Dish}
          locale={locale}
          setOrUpdateMealRecord={updateMealRecordRatios}
        />
        {/* <pre>{JSON.stringify(record, null, 2)}</pre> */}
        <div className="bg-grey-40 my h-[0.5px] w-full" />
        <HadAt
          date={date}
          setDate={setDate}
          messages={messages}
          locale={locale}
        />
      </div>
    </main>
  );
}
