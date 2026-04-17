"use client";

import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import useSWR from "swr";
import TopBar from "@/components/Home/TopBar";
import Streak from "@/components/Home/Streak";
import CalorieGoals from "@/components/Home/CalorieGoals";
import SmartPicks from "@/components/Home/SmartPicks/SmartPicks";
import PreferenceModal, {
  PreferencePayload,
} from "@/components/Home/SmartPicks/PreferenceModal";
import { Goal, Locale, Messages } from "@calculories/shared-types";
import getDishesByIds from "@/services/api/getDishesByIds";
import getUser from "@/services/api/getUser";
import getRecommendedDishes from "@/services/api/getRecommendedDishes"; // <-- Import the new service
import NavBar from "@/components/Shared/NavBar";

export default function HomeClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { loading: authLoading, error: authError, user: authUser } = useUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const [userLat, setUserLat] = useState<number | undefined>(undefined);
  const [userLon, setUserLon] = useState<number | undefined>(undefined);

  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [activePreferences, setActivePreferences] =
    useState<PreferencePayload | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error retrieving location:", error);
        },
      );
    }
  }, []);

  const { data: appUser, isLoading: apiLoading } = useSWR(
    authUser?.id ? `user-profile-${authUser.id}` : null,
    () => getUser(),
  );

  const { data: recommendedDishesPool = [], isValidating: isFetchingPicks } =
    useSWR(
      appUser
        ? `smart-picks-${appUser.id}-${userLat}-${userLon}-${JSON.stringify(activePreferences)}`
        : null,
      async () => {
        const requestBody = {
          user: {
            goal: appUser.goal,

            target_calorie: appUser.target_calorie || 0,
            target_protein: appUser.target_protein || 0,
            target_fat: appUser.target_fat || 0,
            target_carbs: appUser.target_carbs || 0,

            dietary_restrictions: {
              vegetarian: appUser.vegetarian_default || false,
              no_shellfish: appUser.no_shellfish_default || false,
              no_lactose: appUser.no_lactose_default || false,
              no_peanut: appUser.no_peanut_default || false,
              has_gluten: appUser.gluten_free_default || false,
              halal: appUser.halal_default || false,
            },

            diet_profile: {
              calorie_intake: appUser.diet_profile?.calorie_intake || 0,
              protein_intake: appUser.diet_profile?.protein_intake || 0,
              fat_intake: appUser.diet_profile?.fat_intake || 0,
              carbs_intake: appUser.diet_profile?.carbs_intake || 0,
            },

            location: {
              latitude: userLat ?? -90,
              longitude: userLon ?? -180,
            },

            language: locale || "en",
          },
          screen: activePreferences ? "home_modal" : "home",
          top_n: 12,
          sort_by_distance: true,
          ...(activePreferences && {
            preference: {
              selected_pills: activePreferences.selected_pills,
              custom_text: activePreferences.custom_text ?? "",
            },
          }),
        };

        // Abstracted call using the new service function
        const aiData = await getRecommendedDishes(requestBody);
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
      setIsRevealing(false);
      setShowPreferenceModal(true);
    } else {
      setCurrentIndex(nextIndex);
      setIsRevealing(false);
    }
  };

  const handleApplyPreferences = (prefs: PreferencePayload) => {
    setShowPreferenceModal(false);
    setCurrentIndex(0);
    setActivePreferences(prefs);
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
    <main className="relative pb-24">
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

      <PreferenceModal
        isOpen={showPreferenceModal}
        onClose={() => setShowPreferenceModal(false)}
        onApply={handleApplyPreferences}
        messages={messages}
      />
    </main>
  );
}
