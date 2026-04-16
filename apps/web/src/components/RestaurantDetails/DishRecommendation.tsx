"use client";

import {
  Dish,
  getRecommendByRestaurantResponse,
  GetUserResponse,
  Locale,
  Messages,
  Restaurant,
} from "@calculories/shared-types";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { useEffect, useState } from "react";
import getDishesByIds from "@/services/api/getDishesByIds";
import MealCardList from "../Home/SmartPicks/MealCardList";
import getUser from "@/services/api/getUser";
import { notFound } from "next/navigation";
import getRecommendByRestaurant from "@/services/api/getRecommendByRestaurant";
import { MealCardSkeleton } from "../Home/SmartPicks/MealCard";

interface DishRecommendationProps {
  restaurant: Restaurant;
  locale: Locale;
  messages: Messages;
  id: string;
}

export default function DishRecommendation({
  restaurant,
  locale,
  messages,
  id,
}: DishRecommendationProps) {
  const [recommendDishes, setRecommendDishes] = useState<Dish[] | undefined>(
    undefined,
  );

  const [dishrecIds, setDishRecIds] = useState<string[] | undefined>(undefined);
  const [user, setUser] = useState<GetUserResponse | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tempUser = (await getUser()) as GetUserResponse;
        if (!tempUser) return notFound();

        setUser(tempUser);
      } catch (error) {
        console.error(error);
        return notFound();
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user) {
      const fetchRecommendByRestaurant = async () => {
        try {
          const requestBody = {
            user: {
              goal: user!.goal,
              target_calorie: user!.target_calorie,
              target_protein: user!.target_protein,
              target_fat: user!.target_fat,
              target_carbs: user!.target_carbs,
              dietary_restrictions: {
                vegetarian: user!.vegetarian_default!,
                no_shellfish: user!.no_shellfish_default!,
                no_lactose: user!.no_lactose_default!,
                no_peanut: user!.no_peanut_default!,
                gluten_free: user!.gluten_free_default!,
                halal: user!.halal_default!,
              },
              diet_profile: {
                calorie_intake: user!.diet_profile.calorie_intake,
                protein_intake: user!.diet_profile.protein_intake,
                fat_intake: user!.diet_profile.fat_intake,
                carbs_intake: user!.diet_profile.carbs_intake,
              },
              location: {
                latitude: restaurant.lat,
                longitude: restaurant.lon,
              },
              language: locale,
            },
            screen: "restaurant_detail",
            restaurant_id: id,
            top_n: 3,
          };

          const tempResponse = (await getRecommendByRestaurant(
            requestBody,
          )) as getRecommendByRestaurantResponse;
          if (!tempResponse) return notFound();

          setDishRecIds(tempResponse.dish_ids);
        } catch (error) {
          console.error(error);
          return notFound();
        }
      };
      fetchRecommendByRestaurant();
    }
  }, [restaurant.id, locale, user]);

  useEffect(() => {
    if (!dishrecIds) return;

    const fetchDishes = async () => {
      try {
        const response = await getDishesByIds({ ids: dishrecIds!.map(Number) });
        setRecommendDishes(response);
      } catch (error) {
        console.error("Failed to fetch recommended dishes:", error);
        setRecommendDishes(undefined);
      }
    };

    fetchDishes();
  }, [dishrecIds]);

  return (
    <main className="mt-5 flex flex-col items-start justify-center">
      <h1 className="text-1xl text-grey-100 font-bold">
        {t("recommendation title", messages)}
      </h1>
      <div className="mt-3 flex w-full flex-col gap-3">
        {recommendDishes ? (
          <MealCardList
            dishes={recommendDishes}
            locale={locale}
            restaurant={restaurant}
            messages={messages}
          />
        ) : (
          <MealCardSkeleton />
        )}
      </div>
    </main>
  );
}
