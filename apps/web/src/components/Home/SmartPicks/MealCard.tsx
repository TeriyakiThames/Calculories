"use client";

import Image from "next/image";
import {
  DishNoComp,
  Locale,
  UserLocation,
  Restaurant,
} from "@calculories/shared-types";
import calculateDistance from "@/services/calculateDistance";
import MealCardButton from "@/components/Home/SmartPicks/MealCardButton";

interface MealCardProps {
  dish: DishNoComp;
  locale: Locale;
  isRefreshing?: boolean;
  userLocation: UserLocation;
  restaurant?: Restaurant;
}

export const MealCardSkeleton = () => (
  <div className="flex items-center justify-between gap-4 rounded-xl border-[0.5px] border-gray-200 bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD]">
    <div className="flex gap-4">
      <div className="h-20 w-20 animate-pulse self-center rounded-md bg-gray-200" />
      <div className="flex w-42.5 flex-col justify-center gap-1.5">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
        <span className="flex gap-2">
          <div className="h-4 w-12 animate-pulse rounded-sm bg-gray-200" />
          <div className="h-4 w-12 animate-pulse rounded-sm bg-gray-200" />
        </span>
      </div>
    </div>
    <div className="h-11.5 w-11.5 animate-pulse rounded-full bg-gray-200" />
  </div>
);

export default function MealCard({
  dish,
  locale,
  isRefreshing,
  userLocation,
  restaurant,
}: MealCardProps) {
  if (isRefreshing) {
    return <MealCardSkeleton />;
  }

  const RestaurantofDish = dish.restaurant || restaurant;

  const restaurantName =
    locale === "en"
      ? RestaurantofDish?.name_en ||
        RestaurantofDish?.name_th ||
        "Unknown Restaurant"
      : RestaurantofDish?.name_th ||
        RestaurantofDish?.name_en ||
        "Unknown Restaurant";

  const menuName =
    locale === "en"
      ? dish.name_en || dish.name_th || "Unknown Menu"
      : dish.name_th || dish.name_en || "Unknown Menu";

  const dishTypes = dish.dish_types?.map((type) => {
    if (locale === "en") return type.type_en;
    else return type.type_th;
  });

  const calories = dish.total_calorie || "-";
  const price = dish.price || 0;
  const imageUrl = "/Home/UnknownMeal.svg";

  function callCalculateDistance() {
    if (
      userLocation.userLat &&
      userLocation.userLon &&
      RestaurantofDish.lat &&
      RestaurantofDish.lon
    ) {
      return calculateDistance(
        RestaurantofDish.lat,
        RestaurantofDish.lon,
        userLocation.userLat,
        userLocation.userLon,
      );
    } else {
      return "-";
    }
  }

  const distance: number | "-" = callCalculateDistance();

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border-[0.5px] border-gray-200 bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD]">
      <div className="flex gap-4">
        {/* Image */}
        <Image
          src={imageUrl}
          alt={menuName}
          width={80}
          height={80}
          className="h-20 w-20 self-center"
        />

        {/* Restaurant information */}
        <div className="flex max-w-50 flex-col gap-0.5">
          <h3 className="text-grey-60 truncate text-xs font-bold">
            {restaurantName}
          </h3>
          <h2 className="leading-tight font-bold">{menuName}</h2>
          <h3 className="text-grey-60 truncate text-xs leading-tight font-bold">
            {dishTypes?.join(" • ")}
          </h3>
          <h1 className="leading-tight font-bold text-green-100">฿{price}</h1>
          <span className="mt-1 flex gap-1">
            <p className="bg-green-80 rounded-sm py-0.5 pr-1.5 pl-1 text-xs text-white">
              {calories} kcal
            </p>
            <p className="text-grey-60 rounded-sm bg-gray-200 px-1 py-0.5 text-xs">
              {distance} km
            </p>
          </span>
        </div>
      </div>

      <MealCardButton dishId={dish.id} />
    </div>
  );
}
