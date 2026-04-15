"use client";

import {
  CreateMealHistoryRequest,
  setOrUpdateMealRecordRatiosRequest,
  Dish,
  Locale,
  User,
} from "@calculories/shared-types";
import BackButton from "@/components/Shared/BackButton";
import Image from "next/image";
import { Button } from "@/components/Shared/Button";
import { AiSummary } from "@/components/MealDetails/AiSummary";
import { IngredientsDropdown } from "@/components/MealDetails/IngredientsDropdown";
import { MealHeader } from "@/components/MealDetails/MealHeader";
import { NutritionalInfo } from "@/components/MealDetails/NutritionalInfo";
import getDish from "@/services/api/getDish";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import addMealHistory from "@/services/api/addMealHistory";
import getUser from "@/services/api/getUser";

export const MealDetailsClientSkeleton = () => (
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

export default function MealDetailsClient({
  locale,
  id,
}: {
  locale: Locale;
  id: number;
}) {
  const [dish, setDish] = useState<Dish | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [showHalalInfo, setShowHalalInfo] = useState(false);

  // Request body for addMealHistory
  const [requestData, setRequestData] = useState<CreateMealHistoryRequest>({
    dish_id: id,
  });

  const setMealRecordRatios = (data: setOrUpdateMealRecordRatiosRequest) => {
    setRequestData((prev) => {
      return { ...prev, ...data };
    });
  };

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const tempDish = (await getDish(id)) as Dish;

        if (!tempDish) return notFound();

        setDish(tempDish);
      } catch (error) {
        console.error(error);
        return notFound();
      }
    };

    const fetchUser = async () => {
      try {
        const tempUser = (await getUser()) as User;

        if (!tempUser) return notFound();

        setUser(tempUser);
      } catch (error) {
        console.error(error);
        return notFound();
      }
    };

    fetchDish();
    fetchUser();
  }, [id]);

  if (!dish) return <MealDetailsClientSkeleton />;

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
      <div className="relative z-10 -mt-17 flex flex-col gap-7.5 rounded-t-3xl bg-white p-8.75">
        <MealHeader dish={dish} locale={locale} />
        <NutritionalInfo dish={dish} />
        {/* <pre>{JSON.stringify(user, null, 2)}</pre>
        <pre>{JSON.stringify(dish, null, 2)}</pre> */}

        <AiSummary />
        <div className="bg-grey-40 my h-[0.5px] w-full" />
        <IngredientsDropdown
          dish={dish}
          locale={locale}
          setOrUpdateMealRecord={setMealRecordRatios}
          showHalalInfo={showHalalInfo}
          setShowHalalInfo={setShowHalalInfo}
        />
      </div>
      <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-105 border-t border-[#8e8e93] bg-[#f6f7f7] px-9 py-7">
        <Button>Add Meal</Button>
      </div>

      {/* Halal info */}
      {showHalalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50">
            <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto flex w-full max-w-105 flex-col rounded-t-2xl border-t bg-white px-5 pt-5 pb-6">
              <div className="flex justify-between">
                <h2 className="font-bold">Halal Info</h2>
                {/* Close button */}
                <button
                  onClick={() => setShowHalalInfo(false)}
                  title="Close"
                  className="hover:text-grey-100 hover:bg-grey-10 -m-1 rounded-full p-2 hover:cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#858585" // text-grey-60
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x-icon lucide-x text-grey-100"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <p>
                Calculories can only detect whether the ingredients are halal,
                not the cooking procedure. Please check with the restaurant
                before ordering.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
