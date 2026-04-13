"use client";

import useSWR from "swr";
import useUser from "@/hooks/useUser";
import getUser from "@/services/api/getUser";

import PageBottom from "@/components/Shared/PageBottom";
import PageTitle from "@/components/Shared/PageTitle";
import ProfileForm from "@/app/[locale]/settings/profile/ProfileForm";
import { Messages } from "@calculories/shared-types";

export default function ProfileClient({ messages }: { messages: Messages }) {
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

  return (
    <main className="bg-background-10 flex min-h-screen flex-col px-5">
      <PageTitle messages={messages} titleOnly={true} />
      <ProfileForm initialData={appUser} messages={messages} />
      <PageBottom />
    </main>
  );
}
