import Image from "next/image";
import { Dish, Locale } from "@calculories/shared-types";

interface MealCardProps {
  dish: Dish;
  locale: Locale;
  isRefreshing?: boolean;
}

export const MealCardSkeleton = () => (
  <div className="flex h-24 items-center justify-between gap-10.75 rounded-xl border-[0.5px] border-green-100 bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD]">
    <div className="flex gap-4">
      <div className="h-20 w-20 animate-pulse rounded-md bg-gray-200" />
      <div className="flex w-42.5 flex-col justify-center gap-2">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <span className="flex gap-2">
          <div className="h-4 w-12 animate-pulse rounded-sm bg-gray-200" />
          <div className="h-4 w-12 animate-pulse rounded-sm bg-gray-200" />
        </span>
      </div>
    </div>
    <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
  </div>
);

export default function MealCard({
  dish,
  locale,
  isRefreshing,
}: MealCardProps) {
  if (isRefreshing) {
    return <MealCardSkeleton />;
  }

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

  const calories =
    dish.components?.reduce((sum, comp) => sum + comp.calorie, 0) || 0;
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
}
