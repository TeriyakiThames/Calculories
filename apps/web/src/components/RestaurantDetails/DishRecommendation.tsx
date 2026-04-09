import { Locale } from "@calculories/shared-types";

interface DishRecommendationProps {
  restaurantId: number;
  locale: Locale;
}

export default function DishRecommendation({
  restaurantId,
  locale,
}: DishRecommendationProps) {
  return (
    <main className="mt-5 flex flex-col items-start justify-center">
      <h1 className="text-1xl text-grey-100 font-bold">Recommended for You</h1>
      {/* <MealCardList dishes={restaurant.dishes} locale={locale} /> */}
    </main>
  );
}
