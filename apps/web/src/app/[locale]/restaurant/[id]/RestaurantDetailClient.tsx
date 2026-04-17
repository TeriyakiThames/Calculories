"use client";

import { Locale, Messages, Restaurant } from "@calculories/shared-types";
import { notFound } from "next/navigation";
import getRestaurantById from "@/services/api/getRestaurantById";
import RestaurantHeader from "@/components/RestaurantDetails/RestaurantHeader";
import DishRecommendation from "@/components/RestaurantDetails/DishRecommendation";
import AllDishes from "@/components/RestaurantDetails/AllDishes";
import { useEffect, useState } from "react";

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

  // TODO : restaurant detail page skeleton
  if (!restaurant) {
    return <p>Loading..</p>;
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
