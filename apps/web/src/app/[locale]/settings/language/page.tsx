import LanguageSetting from "@/components/Shared/LanguageSetting";
import PageBottom from "@/components/Shared/PageBottom";
import PageTitle from "@/components/Shared/PageTitle";
import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale } from "@calculories/shared-types";

export default async function Language({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");

  return (
    <main className="px-9.5">
      <PageTitle
        text="language-title"
        messages={settingsMessages}
        titleOnly={true}
        backHref={`/${locale}/settings`}
      />
      <LanguageSetting locale={locale} />
      <PageBottom />
    </main>
  );
}
