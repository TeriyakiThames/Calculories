import { Locale, Restaurant, Messages } from "@calculories/shared-types";
import MealCardList from "../Home/SmartPicks/MealCardList";
import { t } from "@/lib/internationalisation/i18n-helpers";

interface AllDishesProps {
  restaurant: Restaurant;
  locale: Locale;
  messages: Messages;
}

export default function AllDishes({
  restaurant,
  locale,
  messages,
}: AllDishesProps) {
  return (
    <main className="mt-5 flex flex-col items-start justify-center">
      <h1 className="text-1xl text-grey-100 font-bold">
        {t("all_dishes_title", messages)}
      </h1>
      <div className="mt-3 flex w-full flex-col gap-3">
        <MealCardList
          dishes={restaurant.dishes}
          locale={locale}
          restaurant={restaurant}
        />
      </div>
    </main>
  );
}
