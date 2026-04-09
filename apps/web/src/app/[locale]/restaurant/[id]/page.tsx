import { Locale, Dish } from "@calculories/shared-types";
import { notFound } from "next/navigation";
import getRestaurantById from "@/services/api/getRestaurantById";
import RestaurantHeader from "@/components/RestaurantDetails/RestaurantHeader";
import DishRecommendation from "@/components/RestaurantDetails/DishRecommendation";
import AllDishes from "@/components/RestaurantDetails/AllDishes";

interface RestaurantDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function RestaurantDetailPage(
  props: RestaurantDetailPageProps,
) {
  const { locale, id } = await props.params;
  const restaurantId = parseInt(id, 10);
  let restaurant;

  try {
    restaurant = await getRestaurantById(restaurantId);
  } catch {
    notFound();
  }

  return (
    <main className="relative px-5 pb-28">
      <RestaurantHeader restaurant={restaurant} locale={locale} />
      <DishRecommendation restaurantId={restaurantId} locale={locale} />
      <AllDishes restaurant={restaurant} locale={locale} />
    </main>
  );
}
