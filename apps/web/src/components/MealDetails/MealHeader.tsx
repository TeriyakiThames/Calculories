import { Dish } from "@calculories/shared-types";

interface MealHeaderProps {
  dish: Dish;
}

export function MealHeader({ dish }: MealHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-[26px] leading-6 font-bold">
        <h1 className="h-fit w-65 text-black">{dish.name_en}</h1>
        <span className="text-center text-green-100">฿{dish.price}</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1">
        {/* TODO: Link to restaurant page when its done */}
        <span className="font-bold text-green-100 underline">
          {dish.restaurant?.name_en}
        </span>
        <span className="text-grey-60 text-xs font-bold">
          {dish.restaurant?.type?.join(" • ")}
        </span>
        <span className="text-grey-40 text-xs wrap-normal">
          {dish.components?.map((component) => component.name_en).join(" • ")}
        </span>
      </div>
    </div>
  );
}
