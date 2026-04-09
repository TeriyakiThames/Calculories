import { Locale, Restaurant } from "@calculories/shared-types";
import MealCardList from "../Home/SmartPicks/MealCardList";

interface AllDishesProps {
  restaurant: Restaurant;
  locale: Locale;
}

export default function AllDishes({ restaurant, locale }: AllDishesProps) {
  return (
    <main className="mt-5 flex flex-col items-start justify-center">
      <h1 className="text-1xl text-grey-100 font-bold">All Dishes</h1>
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
