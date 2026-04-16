"use client";

import {
  CreateMealHistoryRequest,
  setOrUpdateMealRecordRatiosRequest,
  Dish,
  Locale,
  Messages,
  Reason,
  getWhyThisWorksForYouResponse,
  GetUserResponse,
} from "@calculories/shared-types";
import BackButton from "@/components/Shared/BackButton";
import Image from "next/image";
import { Button } from "@/components/Shared/Button";
import { AiSummary } from "@/components/MealDetails/AiSummary";
import { IngredientsDropdown } from "@/components/MealDetails/IngredientsDropdown";
import { MealHeader } from "@/components/MealDetails/MealHeader";
import { NutritionalInfo } from "@/components/MealDetails/NutritionalInfo";
import getDish from "@/services/api/getDish";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import addMealHistory from "@/services/api/addMealHistory";
import getUser from "@/services/api/getUser";
import Popup from "@/components/Shared/Popup";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { useRouter } from "next/navigation";
import getWhyThisWorksForYou from "@/services/api/getWhyThisWorksForYou";

export const MealDetailsClientSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-gray-100">
    {/* Image Skeleton */}
    <div className="">
      <div className="-z-10 h-84 w-full bg-gray-300" />

      {/* Back Button */}
      <div className="absolute top-3.5 left-3 z-10 h-9 w-9 rounded-full bg-gray-200" />
    </div>

    {/* Bottom Card */}
    <div className="relative z-10 -mt-11 flex flex-col gap-7.5 rounded-t-3xl bg-white p-8.75">
      <div className="flex flex-col gap-3">
        {/* Title + Price */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 rounded bg-gray-300" />
          <div className="h-6 w-16 rounded bg-gray-300" />
        </div>

        {/* Restaurant name */}
        <div className="h-4 w-32 rounded bg-gray-200" />

        {/* Restauant type */}
        <div className="h-3 w-48 rounded bg-gray-200" />

        {/* Components */}
        <div className="h-3 w-48 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-2.5">
        {/* ENERGY Card */}
        <div className="space-y-2 rounded-2xl bg-gray-100 p-3.5">
          <div className="mx-auto h-4 w-20 rounded bg-gray-300" />
          <div className="mx-auto h-6 w-16 rounded bg-gray-300" />
        </div>

        {/* Nutrition Cards */}
        <div className="flex gap-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 space-y-2 rounded-2xl bg-gray-100 p-3.5"
            >
              <div className="mx-auto h-4 w-16 rounded bg-gray-300" />
              <div className="mx-auto h-6 w-10 rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Button */}
    <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-105 border-t border-[#8e8e93] bg-[#f6f7f7] px-9 py-7">
      <div className="h-16 w-full rounded-2xl bg-gray-400" />
    </div>
  </div>
);

type Allergen =
  | "gluten"
  | "lactose"
  | "peanuts"
  | "shellfish"
  | "meat"
  | "haram ingredients";
interface allergenAlert {
  visible: boolean;
  allergens: Set<Allergen>;
}

export default function MealDetailsClient({
  locale,
  id,
  messages,
}: {
  locale: Locale;
  id: number;
  messages: Messages;
}) {
  const [dish, setDish] = useState<Dish | undefined>(undefined);
  const [user, setUser] = useState<GetUserResponse | undefined>(undefined);
  const [whyThisWorks, setWhyThisWorks] = useState<Reason[] | undefined>(
    undefined,
  );
  const [showHalalInfo, setShowHalalInfo] = useState(false);
  const [allergenAlert, setAllergenAlert] = useState<allergenAlert>({
    visible: false,
    allergens: new Set<Allergen>(),
  });
  // Request body for addMealHistory
  const [addMealHistoryRequestData, setAddMealHistoryRequestData] =
    useState<CreateMealHistoryRequest>({
      dish_id: id,
    });
  const [creatingMealRecordStatus, setCreatingMealRecordStatus] =
    useState("add_meal");
  const router = useRouter();

  const createMealRecord = async () => {
    try {
      setCreatingMealRecordStatus("adding_meal");
      await addMealHistory(addMealHistoryRequestData);
      setCreatingMealRecordStatus("meal_added");
    } catch (error) {
      console.error(error);
    }
  };

  const setMealRecordRatios = (data: setOrUpdateMealRecordRatiosRequest) => {
    setAddMealHistoryRequestData((prev) => {
      return { ...prev, ...data };
    });
  };

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const tempDish = (await getDish(id)) as Dish;

        if (!tempDish) return notFound();

        setDish(tempDish);
      } catch (error) {
        console.error(error);
        return notFound();
      }
    };

    const fetchUser = async () => {
      try {
        const tempUser = (await getUser()) as GetUserResponse;

        if (!tempUser) return notFound();

        setUser(tempUser);
      } catch (error) {
        console.error(error);
        return notFound();
      }
    };

    const addAllergens = (type: string) => {
      setAllergenAlert((prev) => {
        const newAllergens = new Set<Allergen>(prev.allergens.keys());
        newAllergens.add(type as Allergen);

        return {
          visible: true,
          allergens: newAllergens,
        };
      });
    };

    const checkAllergies = () => {
      if (dish?.has_gluten && user?.gluten_free_default) {
        addAllergens("gluten");
      }
      if (dish?.has_lactose && user?.no_lactose_default) {
        addAllergens("lactose");
      }
      if (dish?.has_peanut && user?.no_peanut_default) {
        addAllergens("peanut");
      }
      if (dish?.has_shellfish && user?.no_shellfish_default) {
        addAllergens("shellfish");
      }
      if (!dish?.is_vegetarian && user?.vegetarian_default) {
        addAllergens("meat");
      }
      if (!dish?.is_halal && user?.halal_default) {
        addAllergens("haram ingredients");
      }
    };

    fetchDish();
    fetchUser();
    if (user && dish) {
      const fetchWhyThisWorksForYou = async () => {
        try {
          const requestBody = {
            user: {
              goal: user!.goal,
              target_calorie: user!.target_calorie,
              target_protein: user!.target_protein,
              target_fat: user!.target_fat,
              target_carbs: user!.target_carbs,
              dietary_restrictions: {
                vegetarian: user!.vegetarian_default!,
                no_shellfish: user!.no_shellfish_default!,
                no_lactose: user!.no_lactose_default!,
                no_peanut: user!.no_peanut_default!,
                gluten_free: user!.gluten_free_default!,
                halal: user!.halal_default!,
              },
              diet_profile: {
                calorie_intake: user!.diet_profile.calorie_intake,
                protein_intake: user!.diet_profile.protein_intake,
                fat_intake: user!.diet_profile.fat_intake,
                carbs_intake: user!.diet_profile.carbs_intake,
              },
              location: {
                latitude: dish!.restaurant.lat,
                longitude: dish!.restaurant.lon,
              },
              language: locale,
            },
            dish: {
              id: String(dish!.id),
              name_en: dish!.name_en,
              name_th: dish!.name_th,
              restaurant_name_en: dish!.restaurant.name_en,
              restaurant_name_th: dish!.restaurant.name_th,
              restaurant_type: dish!.restaurant.restaurant_types.map(
                (t) => t.type_en,
              ),
              price_thb: dish!.price,
              nutrition: {
                calories: dish!.total_calorie,
                protein_g: dish!.total_protein,
                fat_g: dish!.total_fat,
                carbs_g: dish!.total_carbs,
                fiber_g: 0,
              },
            },
          };

          const tempResponse = (await getWhyThisWorksForYou(
            requestBody,
          )) as getWhyThisWorksForYouResponse;

          if (!tempResponse) return notFound();
          const { reasons } = tempResponse;

          setWhyThisWorks(reasons);
          // setWhyThisWorks(reasons.map((r) => ({ ...r, emoji: "✅" })));
        } catch (error) {
          console.error(error);
          return notFound();
        }
      };
      fetchWhyThisWorksForYou();
    }
    checkAllergies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dish?.has_gluten,
    dish?.has_lactose,
    dish?.has_peanut,
    dish?.has_shellfish,
    dish?.is_halal,
    dish?.is_vegetarian,
    id,
    locale,
    user?.gluten_free_default,
    user?.halal_default,
    user?.no_lactose_default,
    user?.no_peanut_default,
    user?.no_shellfish_default,
    user?.vegetarian_default,
  ]);

  if (!dish) return <MealDetailsClientSkeleton />;

  return (
    <main className="relative pb-28">
      <BackButton
        hasBg={true}
        containerClassName="absolute top-3.5 left-3 z-10"
      />
      <Image
        src={"/Dish/MockDish.png"}
        width={420}
        height={335}
        alt="Dish image"
        priority
        className="h-auto w-full object-cover"
      />
      <div className="relative z-10 -mt-17 flex flex-col gap-7.5 rounded-t-3xl bg-white p-8.75">
        <MealHeader dish={dish} locale={locale} />
        <NutritionalInfo dish={dish} messages={messages} />
        <AiSummary reasons={whyThisWorks} messages={messages} />
        <div className="bg-grey-40 my h-[0.5px] w-full" />
        <IngredientsDropdown
          dish={dish}
          locale={locale}
          messages={messages}
          setOrUpdateMealRecord={setMealRecordRatios}
          setShowHalalInfo={setShowHalalInfo}
        />
      </div>
      <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-105 border-t border-[#8e8e93] bg-[#f6f7f7] px-9 py-7">
        <Button onClick={createMealRecord}>
          {t(creatingMealRecordStatus, messages)}
        </Button>
      </div>

      {/* Halal Info */}
      {showHalalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50">
            <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto flex w-full max-w-105 flex-col rounded-t-2xl border-t bg-white px-5 pt-5 pb-6">
              <div className="flex justify-between">
                <h2 className="font-bold">
                  {t("halal_info_heading", messages)}
                </h2>
                {/* Close button */}
                <button
                  onClick={() => setShowHalalInfo(false)}
                  title="Close"
                  className="hover:text-grey-100 hover:bg-grey-10 -m-1 rounded-full p-2 hover:cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#858585" // text-grey-60
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x-icon lucide-x text-grey-100"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <p>{t("halal_info_description", messages)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Allergen Alert / Restriction Alert */}
      {allergenAlert.visible && (
        <Popup
          onClickOutside={() =>
            setAllergenAlert((prev) => ({
              visible: false,
              allergens: new Set<Allergen>(prev.allergens.keys()),
            }))
          }
        >
          <div className="bg-red-20 rounded-full p-2">
            <Image
              src="/Icons/Alert.svg"
              alt="Edit meal record"
              width={48}
              height={48}
            />
          </div>

          <h1 className="text-2xl font-bold">
            {t("allergen_alert_heading", messages)}
          </h1>
          <p>
            {t("allergen_alert_front", messages)}
            <span className="font-bold">
              {Array.from(allergenAlert.allergens)
                .map((a) => t(a, messages))
                .join(", ")
                .replace(/, ([^,]*)$/, `${t("and", messages)} $1`)}
            </span>
            {t("allergen_alert_back", messages)}
          </p>
          <div className="flex w-full flex-col gap-2">
            <button
              onClick={() => router.back()}
              className="w-full rounded-2xl bg-green-100 py-3 font-bold text-white hover:cursor-pointer"
            >
              {t("go_back", messages)}
            </button>
            <button
              onClick={() =>
                setAllergenAlert((prev) => ({
                  visible: false,
                  allergens: new Set<Allergen>(prev.allergens.keys()),
                }))
              }
              className="w-full rounded-2xl border border-red-100 py-3 font-bold text-red-100 hover:cursor-pointer"
            >
              {t("continue_anyway", messages)}
            </button>
          </div>
        </Popup>
      )}
    </main>
  );
}
