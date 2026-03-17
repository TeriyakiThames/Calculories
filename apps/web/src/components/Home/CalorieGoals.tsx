import ProgressBar from "../Shared/ProgressBar";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { User, DietProfile, Messages } from "@calculories/shared-types";

interface CalorieGoalsProps {
  user: User;
  dietProfile: DietProfile;
  messages: Messages;
}

export default function CalorieGoals({
  user,
  dietProfile,
  messages,
}: CalorieGoalsProps) {
  const calories = dietProfile?.calorie_intake || 0;
  const protein = dietProfile?.protein_intake || 0;
  const carbs = dietProfile?.carbs_intake || 0;
  const fats = dietProfile?.fat_intake || 0;

  const caloriesMax = user?.target_calories || 2200;
  const proteinMax = user?.target_protein || 150;
  const carbsMax = user?.target_carbs || 220;
  const fatsMax = user?.target_fats || 75;

  return (
    <div className="mx-4.5 my-6">
      <ProgressBar
        label={t("calories_label", messages)}
        current={calories}
        max={caloriesMax}
        unit="kcal"
        fillColor="bg-green-100"
        trackColor="bg-green-20"
        isMain
      />

      <div className="mt-6">
        <ProgressBar
          label={t("protein_label", messages)}
          current={protein}
          max={proteinMax}
          unit="g"
          fillColor="bg-orange-100"
          trackColor="bg-orange-20"
        />

        <ProgressBar
          label={t("carbs_label", messages)}
          current={carbs}
          max={carbsMax}
          unit="g"
          fillColor="bg-orange-100"
          trackColor="bg-orange-20"
        />

        <ProgressBar
          label={t("fat_label", messages)}
          current={fats}
          max={fatsMax}
          unit="g"
          fillColor="bg-orange-100"
          trackColor="bg-orange-20"
        />
      </div>
    </div>
  );
}
