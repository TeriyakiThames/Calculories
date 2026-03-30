"use client";

import { useState } from "react";
import Image from "next/image";
import { Dish, Component } from "@calculories/shared-types";

interface IngredientsDropdownProps {
  dish: Dish;
}

export function IngredientsDropdown({ dish }: IngredientsDropdownProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!dish) return null;
  const components = dish.components || [];

  // Logic: Green tags (Every component must match)
  const isGlutenFree = components.every((c) => !c.has_gluten);
  const isHalal = components.every((c) => c.is_halal);
  const isVegetarian = components.every((c) => c.is_vegetarian);

  // Logic: Red tags (If any component has it)
  const hasLactose = components.some((c) => c.has_lactose);
  const hasPeanuts = components.some((c) => c.has_peanut);
  const hasSeafood = components.some((c) => c.has_seafood);

  return (
    <div className="flex flex-col gap-5">
      {/* Clickable Header */}
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-grey-100 text-xl font-bold">Ingredients</h2>
        <div
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <Image
            src="/Icons/Dropdown.svg"
            alt="Toggle Dropdown"
            width={24}
            height={24}
          />
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="flex flex-col gap-6">
          {/* Tags Grid */}
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {isGlutenFree && <Tag color="green" text="Gluten-free" />}
            {isHalal && <Tag color="green" text="Halal ingredients" hasIcon />}
            {isVegetarian && <Tag color="green" text="Vegetarian" />}

            {hasPeanuts && <Tag color="red" text="Contains peanuts" />}
            {hasLactose && <Tag color="red" text="Contains lactose" />}
            {hasSeafood && <Tag color="red" text="Contains seafood" />}
          </div>

          {/* Adjust Portions Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-grey-100 text-lg font-bold">Portions</span>

              {/* TODO: Add functionality to edit the portions */}
              <button className="bg-green-10 flex items-center justify-center gap-1 rounded-sm p-1 text-sm leading-none font-bold text-green-100 italic transition-opacity hover:opacity-80">
                <span>Adjust Portion</span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="translate-y-[-0.5px]"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.372 13.879C12.669 13.879 12.91 14.12 12.91 14.417C12.91 14.714 12.669 14.955 12.372 14.955H0.538086C0.240986 14.955 0 14.714 0 14.417C0 14.12 0.240986 13.879 0.538086 13.879H12.372ZM7.06836 4.36923C7.40436 5.00169 7.89936 5.79987 8.5273 6.42782C9.15525 7.05576 9.95343 7.55081 10.5864 7.88681L6.49836 11.9747C6.24436 12.2281 5.91536 12.3927 5.56036 12.4434L3.09836 12.795C2.55136 12.8732 2.08136 12.4037 2.16036 11.8565L2.51136 9.39462C2.56236 9.03972 2.72636 8.71069 2.98036 8.45712L7.06836 4.36923ZM8.90736 2.53036C9.55536 1.88309 10.6044 1.88313 11.2524 2.53036L12.4254 3.70321C13.0724 4.35068 13.0724 5.40052 12.4254 6.04794L11.3854 7.087C11.3034 7.04667 11.2184 7.00291 11.1294 6.95614C10.5304 6.6407 9.81936 6.19774 9.28836 5.66708C8.75736 5.13643 8.31436 4.42545 7.99936 3.82626C7.95236 3.73743 7.90836 3.65184 7.86836 3.5704L8.90736 2.53036Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {components.map((component) => (
                <IngredientRow
                  key={component.component_id}
                  component={component}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TagProps {
  color: "green" | "red";
  text: string;
  hasIcon?: boolean;
}

function Tag({ color, text, hasIcon }: TagProps) {
  const styles = {
    green: "border-green-100 text-green-100 bg-green-1",
    red: "border-red-100 text-red-100 bg-red-1",
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs leading-none ${styles[color]}`}
    >
      <span className="whitespace-nowrap">{text}</span>
      {/* TODO: Show some text if UI has it */}
      {hasIcon && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="6.66667"
            stroke="currentColor"
            strokeWidth="1.33333"
          />
          <path
            d="M8 10.6667V8"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
          />
          <circle cx="8" cy="5.33301" r="0.666667" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

interface IngredientRowProps {
  component: Component;
}

function IngredientRow({ component }: IngredientRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-80">{component.name}</span>
      <span className="text-grey-60 text-xs">
        {/* TODO: Hard coded weight for now since there is no weight field */}
        {(150 * component.ratio).toFixed(0)} grams
      </span>
    </div>
  );
}
