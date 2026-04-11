"use client";

import {
  DishNoComp,
  Locale,
  Messages,
  SortBy,
} from "@calculories/shared-types";
import { useState } from "react";
import { DISH_TYPES } from "@/constants/DishTypes";
import SearchBar from "@/components/Search/SearchBar";
import SortFilterPopup from "@/components/Search/SortFilterPopup";
import { t } from "@/lib/internationalisation/i18n-helpers";
import SubTypes from "@/components/Search/SubTypes";
import { RESTAURANT_TYPES } from "@/constants/RestaurantTypes";

const BATCH_SIZE = 15;

interface SortFilterClientProps {
  locale: Locale;
  messages: Messages;
}

export default function SortFClientrForm({
  locale,
  messages,
}: SortFilterClientProps) {
  const DISH_OPTIONS = DISH_TYPES.filter((type) =>
    [1, 2, 3, 5, 7, 8, 10, 15].includes(type.id),
  );

  // --- Form State ---
  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [ascending, setAscending] = useState<boolean>(true);
  const [dishTypes, setDishTypes] = useState<number[]>([]);
  const [restaurantTypes, setRestaurantTypes] = useState<number[]>([]);
  const [hasDineIn, setHasDineIn] = useState<boolean>(false);
  const [hasDelivery, setHasDelivery] = useState<boolean>(false);
  const [restaurantIsHalal, setRestaurantIsHalal] = useState<boolean>(false);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [dishIsHalal, setDishIsHalal] = useState<boolean>(false);
  const [noGluten, setNoGluten] = useState<boolean>(false);
  const [noLactose, setNoLactose] = useState<boolean>(false);
  const [noPeanut, setNoPeanut] = useState<boolean>(false);
  const [noShellfish, setNoShellfish] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const optionState = {
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
  };

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [dishes, setDishes] = useState<DishNoComp[]>([]);

  const performSearch = (searchString: string) => {};

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        messages={messages}
        onSearch={(query) => performSearch(query)}
      />
      <div className="flex gap-2.5 overflow-x-scroll px-4.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SubTypes
          idList={[8, 11]}
          allItems={DISH_TYPES}
          selectedIds={dishTypes}
          onChange={(val) => setDishTypes(val)}
          locale={locale}
          scroll={true}
        />
        <SubTypes
          idList={[7]}
          allItems={RESTAURANT_TYPES}
          selectedIds={restaurantTypes}
          onChange={(val) => setRestaurantTypes(val)}
          locale={locale}
        />
        <SubTypes
          idList={[17, 10]}
          allItems={DISH_TYPES}
          selectedIds={dishTypes}
          onChange={(val) => setDishTypes(val)}
          locale={locale}
          scroll={true}
        />
      </div>
      <div className="text-grey-60 mx-4.5 flex justify-between">
        <p>
          {dishes.length}
          {hasMore && "+"} {t("result(s) found", messages)}
        </p>
        <div className="flex items-center gap-3.5">
          <button
            title="ascending/decending"
            onClick={() => setAscending(!ascending)}
            className={`transition-transform duration-300 ${ascending && "rotate-x-180"}`}
          >
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
              className="lucide lucide-arrow-up-narrow-wide-icon lucide-arrow-up-narrow-wide"
            >
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
              <path d="M11 12h4" />
              <path d="M11 16h7" />
              <path d="M11 20h10" />
            </svg>
          </button>
          <button
            title="sort and filter"
            className="flex items-center justify-center gap-1"
            onClick={() => setShowPopup(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-settings2-icon lucide-settings-2"
            >
              <path d="M14 17H5" />
              <path d="M19 7h-9" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
            <p>{t("Sort & Filter", messages)}</p>
          </button>
        </div>
      </div>
      <SortFilterPopup
        isShown={showPopup}
        onClose={() => setShowPopup(false)}
        onSelectDishTypes={(value) => setDishTypes(value)}
        dishTypes={dishTypes}
        onSelectRestaurantTypes={(value) => setRestaurantTypes(value)}
        restaurantTypes={restaurantTypes}
        optionState={optionState}
        messages={messages}
        locale={locale}
      />
    </div>
  );
}
