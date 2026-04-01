import { Component } from "@calculories/shared-types";
import { Tag } from "./Tag";

export function DietaryTags({ components }: { components: Component[] }) {
  // Logic: Green tags
  const isGlutenFree = components.every((c) => !c.has_gluten);
  const isHalal = components.every((c) => c.is_halal);
  const isVegetarian = components.every((c) => c.is_vegetarian);

  // Logic: Red tags
  const hasLactose = components.some((c) => c.has_lactose);
  const hasPeanuts = components.some((c) => c.has_peanut);
  const hasShellfish = components.some((c) => c.has_shellfish);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-3">
      {isGlutenFree && <Tag color="green" text="Gluten-free" />}
      {isHalal && <Tag color="green" text="Halal ingredients" hasIcon />}
      {isVegetarian && <Tag color="green" text="Vegetarian" />}
      {hasPeanuts && <Tag color="red" text="Contains peanuts" />}
      {hasLactose && <Tag color="red" text="Contains lactose" />}
      {hasShellfish && <Tag color="red" text="Contains shellfish" />}
    </div>
  );
}
