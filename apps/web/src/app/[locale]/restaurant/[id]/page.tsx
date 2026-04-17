import { Locale } from "@calculories/shared-types";
import { loadMessages } from "@/lib/internationalisation/i18n";
import RestaurantDetailClient from "./RestaurantDetailClient";

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

  return (
    <RestaurantDetailClient
      messages={messages}
      locale={locale}
      id={restaurantId}
    />
  );
}
