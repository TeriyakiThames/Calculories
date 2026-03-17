import Image from "next/image";
import { RefreshIcon } from "../../../public/Icons/Refresh";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Dish, Locale, Messages } from "@calculories/shared-types";

interface SmartPicksProps {
  dishes?: Dish[];
  messages: Messages;
  locale: Locale;
  onRefresh?: () => void;
}

const Header = ({
  messages,
  onRefresh,
}: {
  messages: Messages;
  onRefresh?: () => void;
}) => (
  <div className="flex justify-between">
    <h1 className="text-xl font-bold">{t("smart_picks_title", messages)}</h1>

    <button
      onClick={onRefresh}
      className="flex items-center gap-1 text-green-100 hover:text-gray-400"
      aria-label="Refresh"
    >
      <RefreshIcon />
      <h2 className="font-bold">{t("refresh_label", messages)}</h2>
    </button>
  </div>
);

const MealCard = ({ dish, locale }: { dish: Dish; locale: Locale }) => {
  const restaurantName =
    locale === "en"
      ? dish.restaurant?.name_en ||
        dish.restaurant?.name_th ||
        "Unknown Restaurant"
      : dish.restaurant?.name_th ||
        dish.restaurant?.name_en ||
        "Unknown Restaurant";

  const menuName =
    locale === "en"
      ? dish.name_en || dish.name_th || "Unknown Menu"
      : dish.name_th || dish.name_en || "Unknown Menu";

  const calories = dish.calorie || 0;
  const price = dish.price || 0;

  const imageUrl = "/Home/UnknownMeal.svg";
  // TODO: Calculate this using user's location and dish.restaurant.lat/lon
  const distance = 1.2;

  return (
    <div className="flex h-24 items-center justify-between gap-10.75 rounded-xl border-[0.5px] border-green-100 bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD]">
      <div className="flex gap-4">
        {/* Image */}
        <Image
          src={imageUrl}
          alt={menuName}
          width={80}
          height={80}
          className="h-20 w-20"
        />

        {/* Restaurant information */}
        <div className="flex w-42.5 flex-col gap-1">
          <h3 className="w-42.5 translate-y-1 truncate text-xs font-bold text-green-100">
            {restaurantName}
          </h3>
          <h2 className="w-42.5 truncate font-bold">{menuName}</h2>
          <span className="flex gap-1">
            <p className="rounded-sm bg-[#dcdcdc] px-1 py-0.5 text-xs text-[#777E7D]">
              {calories} kcal
            </p>
            <p className="rounded-sm bg-[#dcdcdc] px-1 py-0.5 text-xs text-[#777E7D]">
              {distance} km
            </p>
          </span>
        </div>
      </div>

      {/* Price */}
      <h1 className="font-bold text-[#8E8E93]">฿{price}</h1>
    </div>
  );
};

export default function SmartPicks({
  dishes = [],
  messages,
  locale,
  onRefresh,
}: SmartPicksProps) {
  return (
    <div className="mx-4.5 flex flex-col gap-3">
      <Header messages={messages} onRefresh={onRefresh} />

      {dishes.map((dish) => (
        <MealCard key={dish.id} dish={dish} locale={locale} />
      ))}

      {dishes.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          {t("no_recommendations", messages)}
        </p>
      )}
    </div>
  );
}
