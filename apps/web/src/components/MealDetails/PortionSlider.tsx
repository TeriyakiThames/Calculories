"use client";

import { IngredientRow } from "@/components/MealDetails/IngredientsDropdown";
import { Component } from "@calculories/shared-types";

interface PortionSliderProps {
  component: Component;
  handleWeightChange: (componentId: number, newWeight: string | number) => void;
}

export default function PortionSlider({
  component,
  handleWeightChange,
}: PortionSliderProps) {
  const percent = component.ratio * 100;
  const fillPercentage = (percent / 200) * 100;

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = Number(e.target.value);

    const baseWeight = component.protein + component.fat + component.carbs;
    const newWeight = baseWeight * (newPercent / 100);

    handleWeightChange(component.id, newWeight);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 py-4">
      {/* Ingredient Row uses the component directly since the parent state updates immediately */}
      <IngredientRow component={component} />

      {/* Slider Area */}
      <div className="relative mt-2 w-full">
        <input
          type="range"
          min="0"
          max="200"
          step="50"
          value={percent}
          onChange={onSliderChange}
          className={`/* Webkit (Chrome, Safari, Edge) Thumb Styling */ /* Firefox Thumb Styling */ h-2 w-full appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-green-100 [&::-moz-range-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-green-100 [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.2)]`}
          style={{
            background: `linear-gradient(to right, var(--color-green-100) ${fillPercentage}%, var(--color-grey-40) ${fillPercentage}%)`,
          }}
        />

        {/* Labels below the track */}
        <div className="text-grey-40 mt-4 flex w-full justify-between text-center text-xs font-bold">
          <span className={`w-8 ${percent >= 0 ? "text-green-100" : ""}`}>
            0%
          </span>
          <span className={`w-8 ${percent >= 50 ? "text-green-100" : ""}`}>
            50%
          </span>
          <span className={`w-8 ${percent >= 100 ? "text-green-100" : ""}`}>
            100%
          </span>
          <span className={`w-8 ${percent >= 150 ? "text-green-100" : ""}`}>
            150%
          </span>
          <span className={`w-8 ${percent === 200 ? "text-green-100" : ""}`}>
            200%
          </span>
        </div>
      </div>
    </div>
  );
}
