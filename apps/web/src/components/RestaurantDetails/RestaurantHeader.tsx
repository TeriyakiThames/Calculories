"use client";

import { Locale, Restaurant } from "@calculories/shared-types";
import Link from "next/link";
import BackButton from "../Shared/BackButton";
import { Button } from "../Shared/Button";
import { useState } from "react";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  locale: Locale;
}

export default function RestaurantHeader({
  restaurant,
  locale,
}: RestaurantHeaderProps) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-start justify-between">
      {/* Return button and restaurant profile */}
      <h1 className="text-grey-100 relative flex w-full items-center justify-center py-5 text-xl font-bold">
        <BackButton containerClassName="absolute left-0" />
        Restaurant Profile
      </h1>

      {/* Restaurant info */}
      <span className="flex gap-5">
        <img
          src={"/Restaurant/MockRestaurant.png"}
          alt="Restaurant picture"
          className="h-22 w-22 rounded-md object-cover"
        />
        <div className="flex h-full flex-col">
          <h1 className="text-grey-100 flex text-2xl leading-tight font-bold">
            {restaurant.name_en}
          </h1>
          <p className="text-grey-60 mt-1 text-xs font-bold">
            {restaurant.restaurant_types
              .map((type) => type.type_en)
              .join(" • ")}
          </p>

          {/* if restaurant is halal */}
          {restaurant.is_halal && (
            <div
              className="mt-2.5"
              onClick={() => setPopupOpen((prev) => !prev)}
            >
              <Tag color="green" text="Halal Restaurant" hasIcon />
            </div>
          )}
        </div>
      </span>

      {/* Map button */}
      <Link href={restaurant.url} className="w-full">
        <Button className="text-1xl mt-3 flex items-center justify-center gap-1 py-5 font-semibold">
          <img src="/Icons/Map.svg" alt="Map button" className="h-5 w-5" />
          <span>Open in Maps</span>
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
          className={`fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-105 rounded-t-xl bg-white px-5 pt-5 pb-8 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] transition-transform duration-100 ease-out ${popupOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <span className="flex flex-row">
            <h1 className="text-grey-100 text-sm font-bold">
              Halal Restaurant
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
            This restaurant declares itself as Halal. Although we perform a
            basic checking, Calculories doesn't perform an in-depth inspection
            of the restaurant regarding this matter.
          </p>
        </div>
      </div>
    </div>
  );
}

// can they make this a global component?
function Tag({
  color,
  text,
  hasIcon,
}: {
  color: "green" | "red";
  text: string;
  hasIcon?: boolean;
}) {
  const styles = {
    green: "border-green-100 text-green-100 bg-green-1",
    red: "border-red-100 text-red-100 bg-red-1",
  };
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs leading-none ${styles[color]}`}
    >
      <span className="whitespace-nowrap">{text}</span>
      {hasIcon && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="6.66667"
            stroke="currentColor"
            strokeWidth="1.33333"
          />
          <path
            d="M8 10.6667V8"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
          />
          <circle cx="8" cy="5.33301" r="0.666667" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
