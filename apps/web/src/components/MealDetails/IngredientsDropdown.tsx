"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Dish,
  Locale,
  setOrUpdateMealRecordRatiosRequest,
  ComponentWithNewRatio,
  Messages,
} from "@calculories/shared-types";
import PortionSlider from "@/components/MealDetails/PortionSlider";
import { Input } from "@/components/Shared/Input";
import { t } from "@/lib/internationalisation/i18n-helpers";

interface IngredientsDropdownProps {
  dish: Dish;
  locale: Locale;
  messages: Messages;
  setOrUpdateMealRecord: ({
    edited_carbs,
    edited_protein,
    edited_fat,
    edited_alcohol,
  }: setOrUpdateMealRecordRatiosRequest) => void;
  setShowHalalInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

type PortionMode = "display" | "slider" | "input";

export function IngredientsDropdown({
  dish,
  locale,
  messages,
  setOrUpdateMealRecord,
  setShowHalalInfo,
}: IngredientsDropdownProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [portionMode, setPortionMode] = useState<PortionMode>("display");
  const [components, setComponents] = useState<ComponentWithNewRatio[]>(
    dish?.components.map((c) => {
      return { ...c, new_ratio: c.ratio };
    }) || [],
  );

  const [prevDish, setPrevDish] = useState<Dish | undefined>(dish);

  if (dish !== prevDish) {
    setPrevDish(dish);
    setComponents(
      dish?.components.map((c) => {
        return { ...c, new_ratio: c.ratio };
      }) || [],
    );
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!dish) return null;

  // Logic: Green tags
  const isGlutenFree = components.every((c) => !c.has_gluten);
  const isHalal = components.every((c) => c.is_halal);
  const isVegetarian = components.every((c) => c.is_vegetarian);

  // Logic: Red tags
  const hasLactose = components.some((c) => c.has_lactose);
  const hasPeanuts = components.some((c) => c.has_peanut);
  const hasShellfish = components.some((c) => c.has_shellfish);

  const selectMode = (mode: PortionMode) => {
    setPortionMode(mode);
    setIsMenuOpen(false);
  };

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

          return { ...c, new_ratio: newRatio };
        }
        return c;
      }),
    );
  };

  const handleDoneEditing = async () => {
    setPortionMode("display");
    const edited_carbs = components.reduce(
      (acc, c) => acc + c.carbs * c.new_ratio,
      0,
    );
    const edited_protein = components.reduce(
      (acc, c) => acc + c.protein * c.new_ratio,
      0,
    );
    const edited_fat = components.reduce(
      (acc, c) => acc + c.fat * c.new_ratio,
      0,
    );
    const edited_alcohol = components.reduce(
      (acc, c) => acc + c.alcohol * c.new_ratio,
      0,
    );
    setOrUpdateMealRecord({
      edited_carbs,
      edited_protein,
      edited_fat,
      edited_alcohol,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Clickable Header */}
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-grey-100 text-xl font-bold">
          {t("ingredients", messages)}
        </h2>
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
          {/* Tags Grid */}
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {isGlutenFree && (
              <Tag color="green" text={t("gluten_free", messages)} />
            )}
            {isHalal && (
              <Tag
                color="green"
                text={t("halal_ingredients", messages)}
                hasIcon
                setShowHalalInfo={setShowHalalInfo}
              />
            )}
            {isVegetarian && (
              <Tag color="green" text={t("vegetarian", messages)} />
            )}
            {hasPeanuts && (
              <Tag color="red" text={t("contains_peanuts", messages)} />
            )}
            {hasLactose && (
              <Tag color="red" text={t("contains_lactose", messages)} />
            )}
            {hasShellfish && (
              <Tag color="red" text={t("contains_shellfish", messages)} />
            )}
          </div>

          {/* Adjust Portions Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-grey-100 text-lg font-bold">
                {t("portions", messages)}
              </span>

              {/* Action Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-green-10 flex items-center justify-center gap-1 rounded-sm p-1 text-sm leading-none font-bold text-green-100 italic transition-opacity hover:opacity-80"
                >
                  <span>
                    {portionMode === "display"
                      ? t("adjust_portion", messages)
                      : t("editing", messages)}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.372 13.879C12.669 13.879 12.91 14.12 12.91 14.417C12.91 14.714 12.669 14.955 12.372 14.955H0.538086C0.240986 14.955 0 14.714 0 14.417C0 14.12 0.240986 13.879 0.538086 13.879H12.372ZM7.06836 4.36923C7.40436 5.00169 7.89936 5.79987 8.5273 6.42782C9.15525 7.05576 9.95343 7.55081 10.5864 7.88681L6.49836 11.9747C6.24436 12.2281 5.91536 12.3927 5.56036 12.4434L3.09836 12.795C2.55136 12.8732 2.08136 12.4037 2.16036 11.8565L2.51136 9.39462C2.56236 9.03972 2.72636 8.71069 2.98036 8.45712L7.06836 4.36923ZM8.90736 2.53036C9.55536 1.88309 10.6044 1.88313 11.2524 2.53036L12.4254 3.70321C13.0724 4.35068 13.0724 5.40052 12.4254 6.04794L11.3854 7.087C11.3034 7.04667 11.2184 7.00291 11.1294 6.95614C10.5304 6.6407 9.81936 6.19774 9.28836 5.66708C8.75736 5.13643 8.31436 4.42545 7.99936 3.82626C7.95236 3.73743 7.90836 3.65184 7.86836 3.5704L8.90736 2.53036Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu Overlay */}
                {isMenuOpen && (
                  <div className="border-grey-10 absolute top-full right-0 z-30 mt-2 w-40 overflow-hidden rounded-lg border bg-white shadow-lg">
                    <button
                      onClick={() => selectMode("slider")}
                      className="hover:bg-green-10 text-grey-80 w-full px-4 py-2 text-left text-sm transition-colors"
                    >
                      {t("edit_by_slider", messages)}
                    </button>
                    <button
                      onClick={() => selectMode("input")}
                      className="hover:bg-green-10 text-grey-80 border-grey-10 w-full border-t px-4 py-2 text-left text-sm transition-colors"
                    >
                      {t("edit_by_grams", messages)}
                    </button>
                    {portionMode !== "display" && (
                      <button
                        onClick={() => selectMode("display")}
                        className="hover:bg-red-1 border-grey-10 w-full border-t px-4 py-2 text-left text-sm text-red-100 transition-colors"
                      >
                        {t("cancel_editing", messages)}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Display Components */}
            <div className="flex flex-col gap-4">
              {portionMode === "display" &&
                components.map((c) => (
                  <IngredientRow
                    key={c.id}
                    component={c}
                    locale={locale}
                    messages={messages}
                  />
                ))}
              {portionMode === "slider" &&
                components.map((c) => (
                  <PortionSlider
                    key={c.id}
                    component={c}
                    handleWeightChange={handleWeightChange}
                    locale={locale}
                    messages={messages}
                  />
                ))}
              {portionMode === "input" && (
                <div className="flex flex-col gap-4">
                  {components.map((c, index) => {
                    const baseWeight = c.protein + c.fat + c.carbs;
                    const currentWeight = (baseWeight * c.new_ratio).toFixed(0);

                    return (
                      <Input
                        key={c.id || index}
                        header={locale === "en" ? c.name_en : c.name_th}
                        type="text"
                        value={currentWeight}
                        unit={t("grams", messages)}
                        onChange={(val) => {
                          handleWeightChange(c.id, val);
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Button */}
            {portionMode !== "display" && (
              <div className="flex w-full gap-4">
                <button
                  onClick={() => selectMode("display")}
                  className="border-grey-100 flex w-full items-center justify-center gap-3 rounded-2xl border bg-white px-4 py-2 transition-transform"
                >
                  {t("cancel", messages)}
                </button>
                <button
                  onClick={handleDoneEditing}
                  className="bg-grey-100 flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-2 text-white transition-transform"
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11.5" cy="11.5" r="11.5" fill="#FDFDFD" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.1693 8.01244C16.6265 8.38525 16.6728 9.03287 16.2727 9.45894L12.0636 13.9419C11.1591 14.9052 9.60113 15.0342 8.52859 14.2346L5.9578 12.318C5.48341 11.9643 5.4065 11.3192 5.78601 10.8771C6.16551 10.435 6.85773 10.3634 7.33212 10.717L9.90291 12.6337C10.0561 12.7479 10.2787 12.7295 10.4079 12.5918L14.6171 8.10887C15.0171 7.6828 15.7121 7.63963 16.1693 8.01244Z"
                      fill="#333333"
                    />
                  </svg>
                  {t("done_editing", messages)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({
  color,
  text,
  hasIcon,
  setShowHalalInfo,
}: {
  color: "green" | "red";
  text: string;
  hasIcon?: boolean;
  setShowHalalInfo?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const styles = {
    green: "border-green-100 text-green-100 bg-green-1",
    red: "border-red-100 text-red-100 bg-red-1",
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs leading-none ${styles[color]}`}
    >
      <span className="whitespace-nowrap">{text}</span>
      {hasIcon && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          onClick={() => setShowHalalInfo!(true)}
          className="hover:cursor-pointer"
        >
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

export function IngredientRow({
  component,
  locale,
  messages,
}: {
  component: ComponentWithNewRatio;
  locale: Locale;
  messages: Messages;
}) {
  const componentName =
    locale === "en"
      ? component.name_en || component.name_th || "Unknown Menu"
      : component.name_th || component.name_en || "Unknown Menu";
  const baseWeight = component.protein + component.fat + component.carbs;
  const currentWeight = (baseWeight * component.new_ratio).toFixed(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-100 leading-5">{componentName}</span>
      <span className="text-grey-60 min-w-15 text-right text-xs leading-5">
        {currentWeight} {t("grams", messages)}
      </span>
    </div>
  );
}
