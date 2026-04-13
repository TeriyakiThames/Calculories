"use client";

import useSWR from "swr";
import useUser from "@/hooks/useUser";
import getUser from "@/services/api/getUser";
import PageBottom from "@/components/Shared/PageBottom";
import PageTitle from "@/components/Shared/PageTitle";
import DietaryForm from "@/app/[locale]/settings/dietary-restrictions/DietaryForm";
import {
  Messages,
  DietaryPreferences,
  Locale,
} from "@calculories/shared-types";

const mapDietaryToArray = (user?: DietaryPreferences | null) => {
  if (!user) return [];

  const dietary: string[] = [];

  if (user.vegetarian_default) dietary.push("Vegetarian");
  if (user.halal_default) dietary.push("Halal Diet");
  if (user.no_lactose_default) dietary.push("Lactose Intolerance");
  if (user.gluten_free_default) dietary.push("Gluten Intolerance");
  if (user.no_peanut_default) dietary.push("Peanut Allergy");
  if (user.no_shellfish_default) dietary.push("Shellfish Allergy");

  return dietary;
};

interface DietaryClientProps {
  locale: Locale;
  messages: Messages;
}

export default function DietaryClient({
  locale,
  messages,
}: DietaryClientProps) {
  const { loading: authLoading, user: authUser } = useUser();

  const { data: appUser, isLoading: apiLoading } = useSWR(
    authUser?.id ? `user-profile-${authUser.id}` : null,
    () => getUser(),
  );

  if (authLoading || apiLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-gray-500">
        <span>Loading your profile...</span>
      </div>
    );
  }

  const currentDietary = mapDietaryToArray(appUser);

  return (
    <main className="bg-background-10 flex min-h-screen flex-col px-5">
      <PageTitle
        messages={messages}
        titleOnly={true}
        backHref={`/${locale}/settings`}
      />
      <DietaryForm initialDietary={currentDietary} messages={messages} />
      <PageBottom />
    </main>
  );
}
