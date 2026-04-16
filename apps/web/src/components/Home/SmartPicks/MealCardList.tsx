"use client";

import { DishNoComp, Locale, Restaurant } from "@calculories/shared-types";
import MealCard from "@/components/Home/SmartPicks/MealCard";
import { useEffect, useState } from "react";

interface MealCardListProps {
  dishes?: DishNoComp[];
  locale: Locale;
  isRefreshing?: boolean;
  restaurant?: Restaurant;
}

export default function MealCardList({
  dishes = [],
  locale,
  isRefreshing,
  restaurant,
}: MealCardListProps) {
  const [userLat, setUserLat] = useState<number | undefined>(undefined);
  const [userLon, setUserLon] = useState<number | undefined>(undefined);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLon(position.coords.longitude);
    });
  }, []);

  return (
    <>
      {dishes.map((dish) => (
        <MealCard
          key={dish.id}
          dish={dish}
          locale={locale}
          isRefreshing={isRefreshing}
          userLocation={{ userLat: userLat, userLon: userLon }}
          restaurant={restaurant}
        />
      ))}
    </>
  );
}
