"use client";

import {
  DishNoComp,
  GetDishesBySearchRequest,
  GetUserResponse,
  LocationType,
  Locale,
  Messages,
  SortBy,
} from "@calculories/shared-types";
import { useEffect, useRef, useState, useCallback } from "react";
import { DISH_TYPES } from "@/constants/DishTypes";
import SearchBar from "@/components/Search/SearchBar";
import SortFilterPopup from "@/components/Search/SortFilterPopup";
import { t } from "@/lib/internationalisation/i18n-helpers";
import SubTypes from "@/components/Search/SubTypes";
import getDishesBySearch from "@/services/api/getDishesBySearch";
import MealCardList from "@/components/Home/SmartPicks/MealCardList";
import { useInView } from "react-intersection-observer";
import getUser from "@/services/api/getUser";
import Loading from "@/components/Shared/Loading";

const BATCH_SIZE = 15;

interface SortFilterClientProps {
  locale: Locale;
  messages: Messages;
}

export default function SortFilterClientForm({
  locale,
  messages,
}: SortFilterClientProps) {
  // --- Form State ---
  const [searchString, setSearchString] = useState<string>();
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

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [dishes, setDishes] = useState<DishNoComp[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const paramsRef = useRef<Omit<GetDishesBySearchRequest, "from" | "to">>({});
  const [endDivRef, inView] = useInView({
    threshold: 0.5,
  });

  const [userInfo, setUserInfo] = useState<GetUserResponse>();
  const [userLocation, setUserLocation] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });

  const optionState = {
    sortBy,
    setSortBy,
    setAscending,
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
    userLocation,
  };

  const loadMore = async (
    params: Partial<GetDishesBySearchRequest>,
    reset?: boolean,
  ) => {
    if (loading) return;

    if (reset) {
      setDishes([]);
      setHasMore(true);
    } else if (!hasMore) {
      return;
    }

    setLoading(true);

    const from = reset ? 0 : dishes.length;
    const to = from + BATCH_SIZE - 1;

    let searchObj;
    if (!userInfo) {
      const newUserInfo: GetUserResponse = await getUser();
      setUserInfo(newUserInfo);
      setIsVegetarian(newUserInfo.vegetarian_default);
      setDishIsHalal(newUserInfo.halal_default);
      setNoGluten(newUserInfo.gluten_free_default);
      setNoLactose(newUserInfo.no_lactose_default);
      setNoPeanut(newUserInfo.no_peanut_default);
      setNoShellfish(newUserInfo.no_shellfish_default);
      searchObj = {
        ...params,
        is_vegetarian: newUserInfo.vegetarian_default,
        dish_is_halal: newUserInfo.halal_default,
        no_gluten: newUserInfo.gluten_free_default,
        no_lactose: newUserInfo.no_lactose_default,
        no_peanut: newUserInfo.no_peanut_default,
        no_shellfish: newUserInfo.no_shellfish_default,
        from: from,
        to: to,
        user: newUserInfo,
      };
    } else {
      searchObj = {
        ...params,
        from: from,
        to: to,
        user: userInfo,
      };
    }

    const newDishes = await getDishesBySearch(searchObj);

    if (newDishes.length < BATCH_SIZE) {
      setHasMore(false);
    }

    setDishes((prev) => [...prev, ...newDishes]);

    setLoading(false);
  };

  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  });

  const handleSearch = useCallback((query: string) => {
    setSearchString(query);
    loadMoreRef.current({ ...paramsRef.current, search_string: query }, true);
  }, []);

  useEffect(() => {
    paramsRef.current = {
      search_string: searchString,
      sort_by: sortBy,
      ascending: ascending,
      dish_type_ids: dishTypes,
      restaurant_type_ids: restaurantTypes,
      has_dine_in: hasDineIn,
      has_delivery: hasDelivery,
      restaurant_is_halal: restaurantIsHalal,
      is_vegetarian: isVegetarian,
      dish_is_halal: dishIsHalal,
      no_gluten: noGluten,
      no_lactose: noLactose,
      no_peanut: noPeanut,
      no_shellfish: noShellfish,
      user: userInfo,
      location: userLocation,
      language: locale,
    };
  }, [
    searchString,
    sortBy,
    ascending,
    dishTypes,
    restaurantTypes,
    hasDineIn,
    hasDelivery,
    restaurantIsHalal,
    isVegetarian,
    dishIsHalal,
    noGluten,
    noLactose,
    noPeanut,
    noShellfish,
    userInfo,
    userLocation,
    locale,
  ]);

  useEffect(() => {
    if (inView) loadMoreRef.current({ ...paramsRef.current });
  }, [inView]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <SearchBar messages={messages} onSearch={handleSearch} />
      <div className="flex shrink-0 gap-2.5 overflow-x-scroll px-4.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SubTypes
          idList={[8, 11, 15, 17, 10]}
          allItems={DISH_TYPES}
          selectedIds={dishTypes}
          onChange={(val) => {
            if (!loading) {
              setDishTypes(val);
              loadMore({ ...paramsRef.current, dish_type_ids: val }, true);
            }
          }}
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
          {sortBy !== "distance" && (
            <button
              title="ascending/decending"
              onClick={() => {
                if (!loading) {
                  const newAscending = !ascending;
                  setAscending(newAscending);
                  loadMore(
                    { ...paramsRef.current, ascending: newAscending },
                    true,
                  );
                }
              }}
              className={`transition-transform duration-300 ${!ascending && "rotate-x-180"}`}
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
          )}
          <button
            title="sort and filter"
            className="flex items-center justify-center gap-1 text-sm leading-none"
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
        onApply={() => {
          setShowPopup(false);
          loadMore({ ...paramsRef.current }, true);
        }}
        onSelectDishTypes={(value) => setDishTypes(value)}
        dishTypes={dishTypes}
        onSelectRestaurantTypes={(value) => setRestaurantTypes(value)}
        restaurantTypes={restaurantTypes}
        optionState={optionState}
        messages={messages}
        locale={locale}
      />
      <div className="border-grey-10 mb-38 flex min-h-0 flex-1 flex-col gap-3 overflow-y-scroll border-t px-4.5 py-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1">
        <MealCardList dishes={dishes} locale={locale} />
        <div
          onClick={() => loadMore({ ...paramsRef.current })}
          className="my-3 flex justify-center"
          ref={endDivRef}
        >
          {hasMore ? (
            <Loading size={10} />
          ) : (
            <p className="text-grey-40 text-sm">
              {t("No more items", messages)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
