"use client";

import { Locale, Messages, Restaurant } from "@calculories/shared-types";
import { notFound } from "next/navigation";
import getRestaurantById from "@/services/api/getRestaurantById";
import RestaurantHeader from "@/components/RestaurantDetails/RestaurantHeader";
import DishRecommendation from "@/components/RestaurantDetails/DishRecommendation";
import AllDishes from "@/components/RestaurantDetails/AllDishes";
import { useEffect, useState } from "react";
import BackButton from "@/components/Shared/BackButton";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { MealCardSkeleton } from "@/components/Home/SmartPicks/MealCard";

interface RestaurantDetailClientProps {
  locale: Locale;
  messages: Messages;
  id: number;
}

export default function RestaurantDetailClient({
  locale,
  messages,
  id,
}: RestaurantDetailClientProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurantById(id);
        if (!response) {
          notFound();
        }
        setRestaurant(response);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        setRestaurant(undefined);
        notFound();
      }
    };
    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return (
      <div className="relative px-5">
        {/* Header */}
        <div className="relative flex flex-col items-start justify-between">
          {/* Return button and restaurant profile */}
          <h1 className="text-grey-100 relative flex w-full items-center justify-center py-7.5 text-xl font-bold">
            <BackButton containerClassName="absolute left-0" />
            {t("restaurant profile", messages)}
          </h1>

          {/* Restaurant Header Section */}
          <div className="flex gap-4">
            {/* Image */}
            <div className="h-22 w-22 animate-pulse rounded-md bg-gray-200" />

            {/* Text */}
            <div className="flex flex-col items-start gap-4">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Button */}
          <div className="mt-3 h-16 w-full animate-pulse rounded-2xl bg-gray-200" />
        </div>

        {/* DishRecommendation */}
        <div className="mt-5 flex flex-col items-start justify-center">
          <h1 className="text-1xl text-grey-100 font-bold">
            {t("recommendation title", messages)}
          </h1>
          <div className="mt-3 flex w-full flex-col gap-3">
            <MealCardSkeleton />
          </div>
        </div>

        {/* AllDishes */}
        <div className="mt-5 flex flex-col items-start justify-center">
          <h1 className="text-1xl text-grey-100 font-bold">
            {t("all_dishes_title", messages)}
          </h1>
          <div className="mt-3 flex w-full flex-col gap-3">
            <MealCardSkeleton />
            <MealCardSkeleton />
            <MealCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative px-5">
      <RestaurantHeader
        restaurant={restaurant}
        locale={locale}
        messages={messages}
      />
      <DishRecommendation
        restaurant={restaurant}
        locale={locale}
        messages={messages}
        id={String(id)}
      />

      <AllDishes restaurant={restaurant} locale={locale} messages={messages} />
    </main>
  );
}
