"use client";

import { Locale, Restaurant, Messages } from "@calculories/shared-types";
import Link from "next/link";
import BackButton from "../Shared/BackButton";
import { Button } from "../Shared/Button";
import { useState } from "react";
import { Tag } from "../MealDetails/IngredientsDropdown/Tag";
import { t } from "@/lib/internationalisation/i18n-helpers";
import Image from "next/image";
interface RestaurantHeaderProps {
  restaurant: Restaurant;
  locale: Locale;
  messages: Messages;
}

export default function RestaurantHeader({
  restaurant,
  locale,
  messages,
}: RestaurantHeaderProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const restaurantName =
    locale === "en"
      ? restaurant?.name_en || restaurant?.name_th
      : restaurant?.name_th || restaurant?.name_en;

  const restaurantTypes = restaurant.restaurant_types.map((type) => {
    if (locale === "en") return type.type_en;
    else return type.type_th;
  });

  return (
    <div className="relative flex flex-col items-start justify-between">
      {/* Return button and restaurant profile */}
      <h1 className="text-grey-100 relative flex w-full items-center justify-center py-5 text-xl font-bold">
        <BackButton containerClassName="absolute left-0" />
        {t("restaurant profile", messages)}
      </h1>

      {/* Restaurant info */}
      <span className="flex gap-5">
        <Image
          src={"/Restaurant/MockRestaurant.png"}
          alt="Restaurant picture"
          className="h-22 w-22 rounded-md object-cover"
        />
        <div className="flex h-full flex-col">
          <h1 className="text-grey-100 flex text-2xl leading-tight font-bold">
            {restaurantName}
          </h1>
          <p className="text-grey-60 mt-1 text-xs font-bold">
            {restaurantTypes.join(" • ")}
          </p>

          {/* if restaurant is halal */}
          {restaurant.is_halal && (
            <div
              className="mt-2.5"
              onClick={() => setPopupOpen((prev) => !prev)}
            >
              <Tag color="green" text={t("halal_tag", messages)} hasIcon />
            </div>
          )}
        </div>
      </span>

      {/* Map button */}
      <Link href={restaurant.url} className="w-full">
        <Button className="text-1xl mt-3 flex items-center justify-center gap-1 py-5 font-semibold">
          <Image src="/Icons/Map.svg" alt="Map button" className="h-5 w-5" />
          <span>{t("map_label", messages)}</span>
        </Button>
      </Link>

      {/* Halal Popup */}
      <div>
        {popupOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setPopupOpen(false)}
          />
        )}
        <div
          className={`fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-105 rounded-t-xl bg-white px-5 pt-5 pb-10 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] transition-transform duration-100 ease-out ${popupOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <span className="flex flex-row">
            <h1 className="text-grey-100 text-sm font-bold">
              {t("halal_tag", messages)}
            </h1>
            <div className="ml-auto">
              <img
                src="/Icons/X.svg"
                alt="Close button"
                className="h-4 w-4 cursor-pointer"
                onClick={() => setPopupOpen(false)}
              />
            </div>
          </span>
          <p className="text-grey-60 mt-1 text-sm">
            {t("halal_message", messages)}
          </p>
        </div>
      </div>
    </div>
  );
}
