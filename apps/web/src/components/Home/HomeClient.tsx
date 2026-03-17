"use client";

import { useState, useEffect, useCallback } from "react";
import useUser from "@/hooks/useUser";
import LocaleSwitcher from "@/components/Shared/LocaleSwitcher";
import AuthButton from "@/components/Shared/AuthButton";
import TopBar from "@/components/Home/TopBar";
import Streak from "@/components/Home/Streak";
import CalorieGoals from "@/components/Home/CalorieGoals";
import SmartPicks from "@/components/Home/SmartPicks";
import SearchBar from "@/components/Home/SearchBar";
import PageBottom from "@/components/Shared/PageBottom";
import DeleteAccountButton from "@/components/Shared/DeleteAccountButton";
import { MockAPI } from "@/mocks/mockAPI";
import {
  Locale,
  Messages,
  GetUserResponse,
  Dish,
} from "@calculories/shared-types";

export default function HomeClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { loading: authLoading, error: authError, user: authUser } = useUser();

  const [appUser, setAppUser] = useState<GetUserResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const [recommendedDishes, setRecommendedDishes] = useState<Dish[]>([]);

  const fetchSmartPicks = useCallback(async () => {
    if (!authUser?.id) return;

    try {
      const fetchedDishes = await MockAPI.getRecommendedDishes(authUser.id);
      setRecommendedDishes(fetchedDishes);
    } catch (err) {
      console.error("Failed to fetch SmartPicks", err);
    }
  }, [authUser?.id]);

  useEffect(() => {
    if (authUser?.id) {
      const fetchDashboardData = async () => {
        setApiLoading(true);
        try {
          const userData = await MockAPI.getUserProfile(authUser.id);
          setAppUser(userData);

          await fetchSmartPicks();
        } catch (err) {
          console.error("Failed to fetch dashboard data", err);
        } finally {
          setApiLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [authUser?.id, fetchSmartPicks]);

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
      <div className="flex items-center justify-center gap-10 border border-black bg-white">
        <LocaleSwitcher locale={locale} />
        <AuthButton messages={messages} />
        <DeleteAccountButton messages={messages} />
      </div>

      {authUser ? (
        <TopBar
          name={authUser.user_metadata?.name || appUser?.username || "User"}
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
          <Streak dietProfile={appUser.dietProfile} messages={messages} />
          <CalorieGoals
            user={appUser}
            dietProfile={appUser.dietProfile}
            messages={messages}
          />
          <SmartPicks
            dishes={recommendedDishes}
            messages={messages}
            locale={locale}
            onRefresh={fetchSmartPicks}
          />
        </>
      )}

      <SearchBar messages={messages} />
      <PageBottom />
    </main>
  );
}
