import { Locale } from "@calculories/shared-types";
import MealDetailsClient from "@/app/[locale]/dish/[id]/MealDetailsClient";

interface DishDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function DishDetailPage(props: DishDetailPageProps) {
  const { locale, id } = await props.params;
  const dishId = parseInt(id, 10);

  return <MealDetailsClient locale={locale} id={dishId} />;
}
