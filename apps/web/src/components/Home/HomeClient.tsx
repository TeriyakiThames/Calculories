"use client";

import useUser from "@/hooks/useUser";
import useSWR from "swr";
import LocaleSwitcher from "@/components/Shared/LocaleSwitcher";
import AuthButton from "@/components/Shared/AuthButton";
import TopBar from "@/components/Home/TopBar";
import Streak from "@/components/Home/Streak";
import CalorieGoals from "@/components/Home/CalorieGoals";
import SmartPicks from "@/components/Home/SmartPicks/SmartPicks";
import SearchBar from "@/components/Home/SearchBar";
import PageBottom from "@/components/Shared/PageBottom";
import DeleteAccountButton from "@/components/Shared/DeleteAccountButton";
import { Locale, Messages } from "@calculories/shared-types";
import getDishesByIds from "@/services/api/getDishesByIds";
import getUser from "@/services/api/getUser";

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
            onRefresh={() => refreshSmartPicks()}
            isRefreshing={isRefreshingPicks}
          />
        </>
      )}

      <SearchBar messages={messages} />
      <PageBottom />
    </main>
  );
}
