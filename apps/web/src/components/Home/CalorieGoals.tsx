import ProgressBar from "../Shared/ProgressBar";
import { t, Messages } from "@/lib/i18n";

interface CalorieGoalsProps {
  calories: number;
  caloriesMax?: number;
  protein: number;
  proteinMax?: number;
  carbs: number;
  carbsMax?: number;
  fats: number;
  fatsMax?: number;
  messages: Messages;
}

export default function CalorieGoals({
  calories = 0,
  caloriesMax = 2200,
  protein = 0,
  proteinMax = 150,
  carbs = 0,
  carbsMax = 220,
  fats = 0,
  fatsMax = 75,
  messages,
}: CalorieGoalsProps) {
  return (
    <div className="mx-4.5 my-6">
      <ProgressBar
        label={t("calories_label", messages)}
        current={calories}
        max={caloriesMax}
        unit="kcal"
        fillColor="bg-[#4AAE9B]"
        trackColor="bg-[#cae1dd]"
        isMain
      />

      <div className="mt-6">
        <ProgressBar
          label={t("protein_label", messages)}
          current={protein}
          max={proteinMax}
          unit="g"
          fillColor="bg-secondary-orange-1"
          trackColor="bg-[#edf3f2]"
        />

        <ProgressBar
          label={t("carbs_label", messages)}
          current={carbs}
          max={carbsMax}
          unit="g"
          fillColor="bg-secondary-orange-1"
          trackColor="bg-[#edf3f2]"
        />

        <ProgressBar
          label={t("fat_label", messages)}
          current={fats}
          max={fatsMax}
          unit="g"
          fillColor="bg-secondary-orange-1"
          trackColor="bg-[#edf3f2]"
        />
      </div>
    </div>
  );
}
