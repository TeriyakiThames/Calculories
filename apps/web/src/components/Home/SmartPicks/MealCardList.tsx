"use client";

import { DishNoComp, Locale } from "@calculories/shared-types";
import MealCard from "@/components/Home/SmartPicks/MealCard";
import { useEffect, useState } from "react";

interface MealCardListProps {
  dishes?: DishNoComp[];
  locale: Locale;
  isRefreshing?: boolean;
}

export default function MealCardList({
  dishes = [],
  locale,
  isRefreshing,
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
        />
      ))}
    </>
  );
}
