import { Dish, Locale } from "@calculories/shared-types";
import Link from "next/link";

interface MealHeaderProps {
  dish: Dish;
  locale: Locale;
}

export function MealHeader({ dish, locale }: MealHeaderProps) {
  const menuName =
    locale === "en"
      ? dish.name_en || dish.name_th || "Unknown Menu"
      : dish.name_th || dish.name_en || "Unknown Menu";

  const restaurantName =
    locale === "en"
      ? dish.restaurant?.name_en ||
        dish.restaurant?.name_th ||
        "Unknown Restaurant"
      : dish.restaurant?.name_th ||
        dish.restaurant?.name_en ||
        "Unknown Restaurant";

  const restaurantTypes = dish.restaurant.restaurant_types.map((type) => {
    if (locale === "en") return type.type_en;
    else return type.type_th;
  });

  const dishComponents = dish.components.map((components) => {
    if (locale === "en") return components.name_en;
    else return components.name_th;
  });

  return (
    <div>
      <div className="flex items-center justify-between text-[26px] leading-6 font-bold">
        <h1 className="h-fit w-65 text-black">{menuName}</h1>
        <span className="text-center text-green-100">฿{dish.price}</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1">
        <Link href={`/${locale}/restaurant/${dish.restaurant.id}`}>
          <span className="font-bold text-green-100 underline">
            {restaurantName}
          </span>
        </Link>
        <span className="text-grey-60 text-xs font-bold">
          {restaurantTypes.join(" • ")}
        </span>
        <span className="text-grey-40 text-xs wrap-normal">
          {dishComponents.join(" • ")}
        </span>
      </div>
    </div>
  );
}
