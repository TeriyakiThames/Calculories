import { t } from "@/lib/internationalisation/i18n-helpers";
import { Dish, Messages } from "@calculories/shared-types";

interface NutrientCardProps {
  nutrient: "ENERGY" | "PROTEIN" | "CARBS" | "FAT";
  value: number;
  messages: Messages;
}

function NutrientCard({ nutrient, value, messages }: NutrientCardProps) {
  const colourMap = {
    ENERGY: "text-[#F39303] text-sm",
    PROTEIN: "text-green-100 text-xs",
    CARBS: "text-[#1C6BD2] text-xs",
    FAT: "text-[#881A9F] text-xs",
  };

  return (
    <div className="flex w-full flex-col items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]">
      <span className={`flex items-center gap-0.5 ${colourMap[nutrient]}`}>
        <svg
          className="h-[1em] w-auto"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 8.05L6.3 0V5.95H9.8L3.5 14V8.05H0Z" fill="currentColor" />
        </svg>
        <span className="font-bold uppercase">{t(nutrient, messages)}</span>
      </span>

      <span className="flex w-full items-baseline justify-between">
        {/* Spacer to make value stay in the middle of the screen */}
        <span className="text-grey-60 invisible text-xs font-bold">
          {nutrient === "ENERGY" ? t("kcal", messages) : t("g", messages)}
        </span>

        <span className="text-grey-100 text-center text-xl font-bold">
          {value !== null && value !== undefined
            ? Number(value.toFixed(0)).toLocaleString()
            : "-"}
        </span>

        <span className="text-grey-60 text-xs font-bold">
          {nutrient === "ENERGY" ? t("kcal", messages) : t("g", messages)}
        </span>
      </span>
    </div>
  );
}

interface NutritionalInfoProps {
  dish: Dish;
  messages: Messages;
}

export function NutritionalInfo({ dish, messages }: NutritionalInfoProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <NutrientCard
        nutrient="ENERGY"
        value={dish.total_calorie}
        messages={messages}
      />
      <span className="flex gap-2.5">
        <NutrientCard
          nutrient="PROTEIN"
          value={dish.total_protein}
          messages={messages}
        />
        <NutrientCard
          nutrient="CARBS"
          value={dish.total_carbs}
          messages={messages}
        />
        <NutrientCard
          nutrient="FAT"
          value={dish.total_fat}
          messages={messages}
        />
      </span>
    </div>
  );
}
