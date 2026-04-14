"use client";

import useSWR from "swr";
import useUser from "@/hooks/useUser";
import getUser from "@/services/api/getUser";

import PageBottom from "@/components/Shared/PageBottom";
import PageTitle from "@/components/Shared/PageTitle";
import GoalForm from "@/app/[locale]/settings/goal/GoalForm";
import { Locale, Messages } from "@calculories/shared-types";

interface GoalClientProps {
  locale: Locale;
  messages: Messages;
}

export default function GoalClient({ locale, messages }: GoalClientProps) {
  // --- Data Fetching ---
  const { loading: authLoading, user: authUser } = useUser();

  const { data: appUser, isLoading: apiLoading } = useSWR(
    authUser?.id ? `user-profile-${authUser.id}` : null,
    () => getUser(),
  );

  // --- Loading State ---
  if (authLoading || apiLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-gray-500">
        <span>Loading your profile...</span>
      </div>
    );
  }

  const currentGoal = appUser?.goal || "";

  return (
    <main className="bg-background-10 flex min-h-screen flex-col px-5">
      <PageTitle
        text="goal-title"
        messages={messages}
        titleOnly={true}
        backHref={`/${locale}/settings`}
      />
      <GoalForm initialGoal={currentGoal} messages={messages} />
      <PageBottom />
    </main>
  );
}
