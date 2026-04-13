"use client";

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

  const { data: appUser, isLoading: apiLoading } = useSWR(
    authUser?.id ? `user-profile-${authUser.id}` : null,
    () => getUser(),
  );

  const {
    data: recommendedDishes = [],
    mutate: refreshSmartPicks,
    isValidating: isRefreshingPicks,
  } = useSWR(
    authUser?.id ? `smart-picks-${authUser.id}` : null,
    () => getDishesByIds({ ids: [1, 2, 3] }),
    {
      //temp for development
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      refreshInterval: 0,
    },
  );

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
            dishes={recommendedDishes}
            messages={messages}
            locale={locale}
            onRefresh={() => refreshSmartPicks()}
            isRefreshing={isRefreshingPicks}
          />
        </>
      )}

      <NavBar messages={messages} />
    </main>
  );
}
