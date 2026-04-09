import SearchBar from "@/components/Search/SearchBar";
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
    ["AuthButton", "DeleteAccountButton"],
    "Shared",
  );

  const messages = { ...sharedMessages, ...SearchMessages };
  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 flex w-full items-center justify-center pt-7.5">
        <h1 className="text-grey-100 text-2xl font-bold">
          {t("Search Food", messages)}
        </h1>
      </div>
      <div className="flex flex-col">
        <SearchBar messages={messages} />
      </div>
      <NavBar />
    </div>
  );
}
