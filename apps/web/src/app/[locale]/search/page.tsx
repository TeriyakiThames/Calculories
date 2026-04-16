import SortFilterClient from "@/components/Search/SortFilterClient";
import NavBar from "@/components/Shared/NavBar";
import { loadMessages } from "@/lib/internationalisation/i18n";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Locale } from "@calculories/shared-types";

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const SearchMessages = await loadMessages(
    locale,
    ["SearchPage", "SearchBar"],
    "Search",
  );

  const sharedMessages = await loadMessages(
    locale,
    ["AuthButton", "DeleteAccountButton", "NavBar", "MealCard"],
    "Shared",
  );

  const messages = { ...sharedMessages, ...SearchMessages };
  return (
    <div className="fixed z-0 flex h-dvh w-full max-w-105 flex-col">
      <div className="mb-6 flex w-full items-center justify-center pt-7.5">
        <h1 className="text-grey-100 text-2xl font-bold">
          {t("Search Food", messages)}
        </h1>
      </div>
      <SortFilterClient locale={locale} messages={messages} />
      <NavBar messages={messages} />
    </div>
  );
}
