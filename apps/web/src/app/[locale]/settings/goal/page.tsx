import PageBottom from "@/components/Shared/PageBottom";
import PageTitle from "@/components/Shared/PageTitle";
import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";
import GoalForm from "@/components/Settings/GoalForm";
import { MockAPI } from "@/mocks/mockAPI";

interface UserProfile {
  id: string;
  goal?: string;
}

export default async function Goal({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");
  const setupMessages = await loadMessages(locale, ["SetupForm"], "Setup");

  let currentGoal = "";

  // TODO: Change this to actual API call ==============
  const mockUser = { id: "mock-user-id-123" };

  if (mockUser) {
    try {
      const profile = (await MockAPI.getUserProfile(
        mockUser.id,
      )) as UserProfile;
      currentGoal = profile?.goal || "";
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
  // ====================================================

  return (
    <main className="flex min-h-screen flex-col px-5">
      <PageTitle messages={settingsMessages} titleOnly={true} />

      <GoalForm
        initialGoal={currentGoal}
        messages={setupMessages}
        locale={locale}
      />

      <PageBottom />
    </main>
  );
}
