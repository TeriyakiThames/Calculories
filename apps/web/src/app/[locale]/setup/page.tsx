import SetupForm from "@/components/Setup/SetupForm";
import SetupHeader from "@/components/Setup/SetupHeader";
import PageTitle from "@/components/Shared/PageTitle";
import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";

export default async function Setup({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const loginMessages = await loadMessages(
    locale,
    ["SetupForm", "SetupHeader", "PageTitle"],
    "Setup",
  );
  return (
    <main className="bg-background-10 px-5">
      <PageTitle messages={loginMessages} />
      <SetupHeader messages={loginMessages} />
      <SetupForm locale={locale} messages={loginMessages} />
    </main>
  );
}
