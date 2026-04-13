"use client";

import useSWR from "swr";
import Image from "next/image";
import PageTitle from "@/components/Shared/PageTitle";
import AuthButton from "@/components/Shared/AuthButton";
import { Locale, Messages } from "@calculories/shared-types";
import useUser from "@/hooks/useUser";
import getUser from "@/services/api/getUser";
import { SettingsButton } from "@/components/Settings/SettingsButton";
import DeleteAccountButton from "@/components/Shared/DeleteAccountButton";
import { t } from "@/lib/internationalisation/i18n-helpers";

export default function SettingsClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  // --- Data Fetching Logic ---
  const { loading: authLoading, error: authError, user: authUser } = useUser();

  const { data: appUser, isLoading: apiLoading } = useSWR(
    authUser?.id ? `user-profile-${authUser.id}` : null,
    () => getUser(),
  );

  // --- Loading & Error States ---
  if (authLoading || apiLoading) {
    return (
      <div className="flex h-screen items-center justify-center space-x-2 p-4 text-gray-500">
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

  // --- Derived Values ---
  const name = authUser?.user_metadata?.name || appUser?.username || "User";
  const imageURL =
    authUser?.user_metadata?.avatar_url || "/Home/MockProfilePicture.svg";

  return (
    <main className="bg-background-10 px-5 pb-10">
      <PageTitle messages={messages} titleOnly={true} />

      <div className="mb-6 flex flex-col items-center gap-6">
        <Image
          src={imageURL}
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full object-cover"
        />
        <span className="text-grey-100 text-center text-3xl font-bold">
          {name}
        </span>
      </div>

      <nav className="flex flex-col gap-5">
        <SettingsButton
          label="Edit Profile"
          link="/settings/profile"
          locale={locale}
          messages={messages}
        />

        <div className="mt-6 flex flex-col gap-5">
          <span className="text-grey-60 text-xl font-bold">
            {t("Settings", messages)}
          </span>
          <SettingsButton
            label="Edit Dietary Restrictions"
            link="/settings/dietary-restrictions"
            locale={locale}
            messages={messages}
          />
          <SettingsButton
            label="Edit Goal"
            link="/settings/goal"
            locale={locale}
            messages={messages}
          />
          <SettingsButton
            label="Edit Language"
            link="/settings/language"
            locale={locale}
            messages={messages}
          />
          <AuthButton messages={messages} />
          <DeleteAccountButton messages={messages} />
        </div>
      </nav>
    </main>
  );
}
