import { Locale } from "@calculories/shared-types";
import { notFound } from "next/navigation";
import getRestaurantById from "@/services/api/getRestaurantById";
import RestaurantHeader from "@/components/RestaurantDetails/RestaurantHeader";
import DishRecommendation from "@/components/RestaurantDetails/DishRecommendation";
import AllDishes from "@/components/RestaurantDetails/AllDishes";
import { loadMessages } from "@/lib/internationalisation/i18n";

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
  const messages = await loadMessages(
    locale,
    ["RestaurantHeader", "DishRecommendation", "AllDishes"],
    "RestaurantDetails",
  );

  const restaurant = await getRestaurantById(restaurantId);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="relative px-5">
      <RestaurantHeader
        restaurant={restaurant}
        locale={locale}
        messages={messages}
      />
      <DishRecommendation
        restaurant={restaurant}
        locale={locale}
        messages={messages}
        id={id}
      />

      <AllDishes restaurant={restaurant} locale={locale} messages={messages} />
    </main>
  );
}
