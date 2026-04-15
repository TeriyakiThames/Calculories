"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import useSWR from "swr";
import TopBar from "@/components/Home/TopBar";
import Streak from "@/components/Home/Streak";
import CalorieGoals from "@/components/Home/CalorieGoals";
import SmartPicks from "@/components/Home/SmartPicks/SmartPicks";
import { Locale, Messages } from "@calculories/shared-types";
import getDishesByIds from "@/services/api/getDishesByIds";
import getUser from "@/services/api/getUser";
import NavBar from "@/components/Shared/NavBar";

export default function HomeClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { loading: authLoading, error: authError, user: authUser } = useUser();

  // States for pagination and our artificial timer
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const { data: appUser, isLoading: apiLoading } = useSWR(
    authUser?.id ? `user-profile-${authUser.id}` : null,
    () => getUser(),
  );

  const {
    data: recommendedDishesPool = [],
    mutate: fetchNewPicks,
    isValidating: isFetchingPicks,
  } = useSWR(
    appUser ? `smart-picks-${appUser.id}` : null,
    async () => {
      const requestBody = {
        user: {
          goal: appUser.goal || "Balanced",
          target_calorie: appUser.diet_profile?.target_calories || 0,
          target_protein: appUser.diet_profile?.target_protein || 0,
          target_fat: appUser.diet_profile?.target_fat || 0,
          target_carbs: appUser.diet_profile?.target_carbs || 0,
          dietary_restrictions: appUser.dietary_restrictions || {
            vegetarian: false,
            no_shellfish: false,
            no_lactose: false,
            no_peanut: false,
            gluten_free: false,
            halal: false,
          },
          diet_profile: {
            calorie_intake: appUser.diet_profile?.calorie_intake || 0,
            protein_intake: appUser.diet_profile?.protein_intake || 0,
            fat_intake: appUser.diet_profile?.fat_intake || 0,
            carbs_intake: appUser.diet_profile?.carbs_intake || 0,
          },
          location: {
            latitude: appUser.location?.latitude || -90,
            longitude: appUser.location?.longitude || -180,
          },
          language: locale || "en",
        },
        screen: "home",
        top_n: 12,
        sort_by_distance: true,
      };

      const aiResponse = await fetch(
        "https://calculories-ai-recommender.onrender.com/recommend/home",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!aiResponse.ok) {
        throw new Error("Failed to fetch recommended dishes from AI");
      }

      const aiData = await aiResponse.json();
      const dishIds = aiData.dish_ids.map(Number);

      if (dishIds.length === 0) {
        return [];
      }

      return getDishesByIds({ ids: dishIds });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      refreshInterval: 0,
    },
  );

  const displayedDishes = recommendedDishesPool.slice(
    currentIndex,
    currentIndex + 3,
  );

  const handleRefresh = async () => {
    setIsRevealing(true);
    // Artifical delay cause without it, the loading feels too abrupt
    await new Promise((resolve) => setTimeout(resolve, 600));
    const nextIndex = currentIndex + 3;

    if (nextIndex >= recommendedDishesPool.length) {
      setCurrentIndex(0);
      await fetchNewPicks();
    } else {
      setCurrentIndex(nextIndex);
    }

    setIsRevealing(false);
  };

  if (authLoading || apiLoading) {
    return (
      <div className="flex items-center space-x-2 p-4 text-gray-500">
        <span>Loading user data...</span>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="m-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        <p>Error: {authError.message}</p>
      </div>
    );
  }

  return (
    <main>
      {authUser ? (
        <TopBar
          name={appUser?.username || authUser.user_metadata?.name || "User"}
          imageURL={
            authUser.user_metadata?.avatar_url || "/Home/MockProfilePicture.svg"
          }
          messages={messages}
        />
      ) : (
        <TopBar name={"User"} messages={messages} />
      )}

      {appUser && (
        <>
          <Streak dietProfile={appUser.diet_profile} messages={messages} />
          <CalorieGoals
            user={appUser}
            dietProfile={appUser.diet_profile}
            messages={messages}
          />
          <SmartPicks
            dishes={displayedDishes}
            messages={messages}
            locale={locale}
            onRefresh={handleRefresh}
            isRefreshing={isFetchingPicks || isRevealing}
          />
        </>
      )}

      <NavBar messages={messages} />
    </main>
  );
}
