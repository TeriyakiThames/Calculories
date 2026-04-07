import { RefreshIcon } from "@/../public/Icons/Refresh";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { DishNoComp, Locale, Messages } from "@calculories/shared-types";
import MealCardList from "@/components/Home/SmartPicks/MealCardList";

interface SmartPicksProps {
  dishes?: DishNoComp[];
  messages: Messages;
  locale: Locale;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const SmartPicksHeader = ({
  messages,
  onRefresh,
  isRefreshing,
}: {
  messages: Messages;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) => (
  <div className="flex justify-between">
    <h1 className="text-xl font-bold">{t("smart_picks_title", messages)}</h1>

    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-1 text-green-100 hover:text-gray-400 disabled:opacity-50"
      aria-label="Refresh"
    >
      <div className={isRefreshing ? "animate-spin" : ""}>
        <RefreshIcon />
      </div>
      <h2 className="font-bold">{t("refresh_label", messages)}</h2>
    </button>
  </div>
);

export default function SmartPicks({
  dishes = [],
  messages,
  locale,
  onRefresh,
  isRefreshing,
}: SmartPicksProps) {
  return (
    <div className="mx-4.5 flex flex-col gap-3">
      <SmartPicksHeader
        messages={messages}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      <MealCardList
        dishes={dishes}
        locale={locale}
        isRefreshing={isRefreshing}
      />

      {dishes.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          {t("no_recommendations", messages)}
        </p>
      )}
    </div>
  );
}
