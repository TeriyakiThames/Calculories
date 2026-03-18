import SetupForm from "@/components/Setup/SetupForm";
import SetupHeader from "@/components/Setup/SetupHeader";
import SetupTitle from "@/components/Setup/SetupTitle";
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
    ["SetupForm", "SetupHeader", "SetupTitle"],
    "Setup",
  );
  return (
    <main className="bg-background-10 px-5">
      <SetupTitle locale={locale} messages={loginMessages} />
      <SetupHeader messages={loginMessages} />
      <SetupForm locale={locale} messages={loginMessages} />
    </main>
  );
}
