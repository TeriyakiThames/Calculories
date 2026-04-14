import { Locale, Messages } from "@calculories/shared-types";
import { t } from "@/lib/internationalisation/i18n-helpers";

interface DishRecommendationProps {
  restaurantId: number;
  locale: Locale;
  messages: Messages;
}

export default function DishRecommendation({
  restaurantId,
  locale,
  messages,
}: DishRecommendationProps) {
  return (
    <main className="mt-5 flex flex-col items-start justify-center">
      <h1 className="text-1xl text-grey-100 font-bold">
        {t("recommendation title", messages)}
      </h1>
      {/* <MealCardList dishes={restaurant.dishes} locale={locale} /> */}
    </main>
  );
}
