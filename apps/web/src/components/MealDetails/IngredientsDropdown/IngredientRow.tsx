import { Component } from "@calculories/shared-types";

export function IngredientRow({ component }: { component: Component }) {
  const baseWeight = component.protein + component.fat + component.carbs;
  const currentWeight = (baseWeight * component.ratio).toFixed(0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-100 leading-5">{component.name_en}</span>
      <span className="text-grey-60 text-xs leading-5">
        {currentWeight} grams
      </span>
    </div>
  );
}
