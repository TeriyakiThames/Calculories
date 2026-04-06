"use client";

import { useState } from "react";
import Image from "next/image";
import { Dish, Component, Locale } from "@calculories/shared-types";
import PortionSlider from "@/components/MealDetails/PortionSlider";
import { Input } from "@/components/Shared/Input";

import { DietaryTags } from "./DietaryTags";
import { PortionHeader, PortionMode } from "./PortionHeader";
import { IngredientRow } from "./IngredientRow";

interface IngredientsDropdownProps {
  dish: Dish;
  locale: Locale;
}

export function IngredientsDropdown({
  dish,
  locale,
}: IngredientsDropdownProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [portionMode, setPortionMode] = useState<PortionMode>("display");
  const [components, setComponents] = useState<Component[]>(
    dish?.components || [],
  );

  const [prevDishId, setPrevDishId] = useState(dish?.id);

  if (dish?.id !== prevDishId) {
    setPrevDishId(dish?.id);
    setComponents(dish?.components || []);
    setPortionMode("display");
  }

  if (!dish) return null;

  const handleWeightChange = (
    componentId: number,
    newWeightStr: string | number,
  ) => {
    const newWeight = Number(newWeightStr);
    if (isNaN(newWeight)) return;

    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === componentId) {
          const baseWeight = c.protein + c.fat + c.carbs;
          const newRatio = baseWeight > 0 ? newWeight / baseWeight : 0;
          return { ...c, ratio: newRatio };
        }
        return c;
      }),
    );
  };

  const handleDoneEditing = async () => {
    setPortionMode("display");
    // TODO: API logic here
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Clickable Header */}
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-grey-100 text-xl font-bold">Ingredients</h2>
        <div
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <Image
            src="/Icons/Dropdown.svg"
            alt="Toggle"
            width={24}
            height={24}
          />
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="flex flex-col gap-6">
          <DietaryTags components={components} />

          <div className="flex flex-col gap-4">
            <PortionHeader
              portionMode={portionMode}
              setPortionMode={setPortionMode}
            />

            {/* Display Components Section */}
            <div className="flex flex-col gap-4">
              {portionMode === "display" &&
                components.map((c) => (
                  <IngredientRow key={c.id} component={c} />
                ))}

              {portionMode === "slider" &&
                components.map((c) => (
                  <PortionSlider
                    key={c.id}
                    component={c}
                    handleWeightChange={handleWeightChange}
                    locale={locale}
                  />
                ))}

              {portionMode === "input" && (
                <div className="flex flex-col gap-4">
                  {components.map((c, index) => {
                    const baseWeight = c.protein + c.fat + c.carbs;
                    const currentWeight = (baseWeight * c.ratio).toFixed(0);

                    return (
                      <Input
                        key={c.id || index}
                        header={c.name_en}
                        type="text"
                        value={currentWeight}
                        unit="grams"
                        onChange={(val) => handleWeightChange(c.id, val)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Button */}
            {portionMode !== "display" && (
              <button
                onClick={handleDoneEditing}
                className="bg-grey-100 flex w-full items-center justify-center gap-3 rounded-2xl px-17 py-2 text-white transition-transform"
              >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                  <circle cx="11.5" cy="11.5" r="11.5" fill="#FDFDFD" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.1693 8.01244C16.6265 8.38525 16.6728 9.03287 16.2727 9.45894L12.0636 13.9419C11.1591 14.9052 9.60113 15.0342 8.52859 14.2346L5.9578 12.318C5.48341 11.9643 5.4065 11.3192 5.78601 10.8771C6.16551 10.435 6.85773 10.3634 7.33212 10.717L9.90291 12.6337C10.0561 12.7479 10.2787 12.7295 10.4079 12.5918L14.6171 8.10887C15.0171 7.6828 15.7121 7.63963 16.1693 8.01244Z"
                    fill="#333333"
                  />
                </svg>
                Done Editing
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
