import { DISH_TYPES } from "@/constants/DishTypes";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Locale, Messages, SortBy } from "@calculories/shared-types";
import Image from "next/image";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import SubTypes from "@/components/Search/SubTypes";
import { RESTAURANT_TYPES } from "@/constants/RestaurantTypes";

interface OptionStateType {
  sortBy: SortBy | undefined;
  setSortBy: Dispatch<SetStateAction<SortBy | undefined>>;
  hasDineIn: boolean;
  setHasDineIn: Dispatch<SetStateAction<boolean>>;
  hasDelivery: boolean;
  setHasDelivery: Dispatch<SetStateAction<boolean>>;
  restaurantIsHalal: boolean;
  setRestaurantIsHalal: Dispatch<SetStateAction<boolean>>;
  isVegetarian: boolean;
  setIsVegetarian: Dispatch<SetStateAction<boolean>>;
  dishIsHalal: boolean;
  setDishIsHalal: Dispatch<SetStateAction<boolean>>;
  noGluten: boolean;
  setNoGluten: Dispatch<SetStateAction<boolean>>;
  noLactose: boolean;
  setNoLactose: Dispatch<SetStateAction<boolean>>;
  noPeanut: boolean;
  setNoPeanut: Dispatch<SetStateAction<boolean>>;
  noShellfish: boolean;
  setNoShellfish: Dispatch<SetStateAction<boolean>>;
}

interface SortFilterPopupProps {
  isShown: boolean;
  onClose: () => void;
  onSelectDishTypes?: (value: number[]) => void;
  dishTypes: number[];
  onSelectRestaurantTypes?: (value: number[]) => void;
  restaurantTypes: number[];
  optionState: OptionStateType;
  messages: Messages;
  locale: Locale;
}

interface SortOptionType {
  value: SortBy;
  text: string;
  icon: string;
}

export default function SortFilterPopup({
  isShown,
  onClose,
  onSelectDishTypes = (value) => {},
  dishTypes,
  onSelectRestaurantTypes = (value) => {},
  restaurantTypes,
  optionState,
  messages,
  locale,
}: SortFilterPopupProps) {
  const SortOptions: SortOptionType[] = [
    { value: "price", text: t("Price", messages), icon: "/Icons/Price.svg" },
    {
      value: "total_calorie",
      text: t("Calories", messages),
      icon: "/Icons/Calories.svg",
    },
    {
      value: "total_protein",
      text: t("Protein", messages),
      icon: "/Icons/Protein.svg",
    },
    {
      value: "total_carbs",
      text: t("Carbohydrate", messages),
      icon: "/Icons/Carbohydrate.svg",
    },
    { value: "total_fat", text: t("Fat", messages), icon: "/Icons/Fat.svg" },
  ];

  const {
    sortBy,
    setSortBy,
    hasDineIn,
    setHasDineIn,
    hasDelivery,
    setHasDelivery,
    restaurantIsHalal,
    setRestaurantIsHalal,
    isVegetarian,
    setIsVegetarian,
    dishIsHalal,
    setDishIsHalal,
    noGluten,
    setNoGluten,
    noLactose,
    setNoLactose,
    noPeanut,
    setNoPeanut,
    noShellfish,
    setNoShellfish,
  } = optionState;

  return (
    <div
      className={`fixed inset-0 z-60 flex items-center justify-center transition-transform duration-400 ${!isShown && "translate-y-full"}`}
    >
      <div className="z-60 flex h-full w-full max-w-105 flex-col gap-2.5 overflow-y-scroll bg-white p-7.5 pb-24 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button onClick={onClose} title="calculories" className="self-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x-icon lucide-x text-grey-100"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <h2 className="text-grey-100 text-xl font-bold">
                {t("Sort By", messages)}
              </h2>
              <button
                onClick={() => setSortBy(undefined)}
                className="text-sm font-bold text-green-100"
              >
                {t("Clear Sort", messages)}
              </button>
            </div>
            <div className="text-grey-100 flex flex-col gap-2.5">
              {SortOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={option.icon}
                      alt={option.text}
                      width={24}
                      height={24}
                    />
                    <p className="leading-none">{option.text}</p>
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${option.value == sortBy ? "border-green-100" : "border-grey-60"}`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-200 ${option.value == sortBy && "bg-green-100"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dish Types */}
          <div className="flex flex-col gap-3">
            <h2 className="text-grey-100 text-xl leading-none font-bold">
              {t("Dish Types", messages)}
            </h2>
            <SubTypes
              idList={[1, 2, 8, 14]}
              allItems={DISH_TYPES}
              selectedIds={dishTypes}
              onChange={(val) => onSelectDishTypes(val)}
              locale={locale}
            />
            <ShowMore messages={messages}>
              {/* Cuisine */}
              <SubTypes
                title={t("Cuisine", messages)}
                idList={[4, 3, 5, 7, 6]}
                allItems={DISH_TYPES}
                selectedIds={dishTypes}
                onChange={(val) => onSelectDishTypes(val)}
                locale={locale}
              />
              {/* Main Dishes */}
              <SubTypes
                title={t("Main Dishes", messages)}
                idList={[9, 10, 17]}
                allItems={DISH_TYPES}
                selectedIds={dishTypes}
                onChange={(val) => onSelectDishTypes(val)}
                locale={locale}
              />
              {/* Light & Sides */}
              <SubTypes
                title={t("Light & Sides", messages)}
                idList={[13, 12, 11]}
                allItems={DISH_TYPES}
                selectedIds={dishTypes}
                onChange={(val) => onSelectDishTypes(val)}
                locale={locale}
              />
              {/* Dessert & Drinks */}
              <SubTypes
                title={t("Dessert & Drinks", messages)}
                idList={[15]}
                allItems={DISH_TYPES}
                selectedIds={dishTypes}
                onChange={(val) => onSelectDishTypes(val)}
                locale={locale}
              />
              {/* Fast Options */}
              <SubTypes
                title={t("Fast Options", messages)}
                idList={[16]}
                allItems={DISH_TYPES}
                selectedIds={dishTypes}
                onChange={(val) => onSelectDishTypes(val)}
                locale={locale}
              />
            </ShowMore>
          </div>

          {/* Restaurant Types */}
          <div className="flex flex-col gap-3">
            <h2 className="text-grey-100 text-xl leading-none font-bold">
              {t("Restaurant Types", messages)}
            </h2>
            <SubTypes
              idList={[1, 5, 15, 2]}
              allItems={RESTAURANT_TYPES}
              selectedIds={restaurantTypes}
              onChange={(val) => onSelectRestaurantTypes(val)}
              locale={locale}
            />
            <ShowMore messages={messages}>
              {/* Cuisine */}
              <SubTypes
                title={t("Cuisine", messages)}
                idList={[3, 9, 4, 11, 10, 17]}
                allItems={RESTAURANT_TYPES}
                selectedIds={restaurantTypes}
                onChange={(val) => onSelectRestaurantTypes(val)}
                locale={locale}
              />
              {/* Healthy & Light */}
              <SubTypes
                title={t("Healthy & Light", messages)}
                idList={[6, 16]}
                allItems={RESTAURANT_TYPES}
                selectedIds={restaurantTypes}
                onChange={(val) => onSelectRestaurantTypes(val)}
                locale={locale}
              />
              {/* Casual & Social */}
              <SubTypes
                title={t("Casual & Social", messages)}
                idList={[14, 7, 13]}
                allItems={RESTAURANT_TYPES}
                selectedIds={restaurantTypes}
                onChange={(val) => onSelectRestaurantTypes(val)}
                locale={locale}
              />
              {/* Specialty */}
              <SubTypes
                title={t("Specialty", messages)}
                idList={[12, 8]}
                allItems={RESTAURANT_TYPES}
                selectedIds={restaurantTypes}
                onChange={(val) => onSelectRestaurantTypes(val)}
                locale={locale}
              />
            </ShowMore>
          </div>

          {/* Restaurant Options */}
          <div className="flex flex-col gap-3">
            <h2 className="text-grey-100 text-xl leading-none font-bold">
              {t("Restaurant Options", messages)}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <ToggleButton
                value={hasDineIn}
                onChange={setHasDineIn}
                text={t("Has dine in", messages)}
              />
              <ToggleButton
                value={hasDelivery}
                onChange={setHasDelivery}
                text={t("Has delivery", messages)}
              />
              <ToggleButton
                value={restaurantIsHalal}
                onChange={setRestaurantIsHalal}
                text={t("Is halal", messages)}
              />
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="flex flex-col gap-3">
            <h2 className="text-grey-100 text-xl leading-none font-bold">
              {t("Dietary Restrictions", messages)}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <ToggleButton
                value={isVegetarian}
                onChange={setIsVegetarian}
                text={t("Vegetarian", messages)}
              />
              <ToggleButton
                value={dishIsHalal}
                onChange={setDishIsHalal}
                text={t("Halal", messages)}
              />
              <ToggleButton
                value={noGluten}
                onChange={setNoGluten}
                text={t("Gluten-free", messages)}
              />
              <ToggleButton
                value={noLactose}
                onChange={setNoLactose}
                text={t("Lactose-free", messages)}
              />
              <ToggleButton
                value={noPeanut}
                onChange={setNoPeanut}
                text={t("Peanut-free", messages)}
              />
              <ToggleButton
                value={noShellfish}
                onChange={setNoShellfish}
                text={t("Shellfish-free", messages)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Reset & Apply */}
      <div className="fixed bottom-0 z-60 flex w-full max-w-105 justify-between gap-3 bg-linear-to-t from-white via-white via-80% to-transparent px-7.5 py-5">
        <button
          onClick={() => {
            setSortBy(undefined);
            onSelectDishTypes([]);
            onSelectRestaurantTypes([]);
            setHasDineIn(false);
            setHasDelivery(false);
            setRestaurantIsHalal(false);
            setIsVegetarian(false);
            setDishIsHalal(false);
            setNoGluten(false);
            setNoLactose(false);
            setNoPeanut(false);
            setNoShellfish(false);
          }}
          className="flex grow justify-center rounded-4xl border border-green-100 bg-white p-4 text-sm leading-none font-bold text-green-100"
        >
          {t("Reset", messages)}
        </button>
        <button className="flex grow justify-center rounded-4xl bg-green-100 p-4 text-sm leading-none font-bold text-white">
          {t("Apply", messages)}
        </button>
      </div>
    </div>
  );
}

function ShowMore({
  children,
  messages,
}: {
  children: ReactNode;
  messages: Messages;
}) {
  const [isShown, setIsShown] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ${isShown ? `max-h-200` : "max-h-0"}`}
      >
        {children}
      </div>
      <button
        onClick={() => setIsShown(!isShown)}
        className={`flex w-fit items-center gap-px text-xs font-bold text-green-100 ${isShown && "mt-2"}`}
      >
        <p className="leading-none">
          {isShown ? t("Show Less", messages) : t("Show More", messages)}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-down-icon lucide-chevron-down mt-pxtransition-transform duration-300 ${isShown && "rotate-x-180"}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}

interface ToggleButtonProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  text: string;
}

function ToggleButton({ value = false, onChange, text }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`rounded-[40px] border px-4 py-3 text-center text-xs leading-none text-nowrap transition-colors ${
        value
          ? "bg-green-10 border-green-100 text-green-100"
          : "bg-background-1 text-grey-60 border-grey-60"
      }`}
    >
      {text}
    </button>
  );
}
