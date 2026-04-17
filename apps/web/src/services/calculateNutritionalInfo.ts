import { MealRecord } from "@calculories/shared-types";

interface CalculateNutritionalInfoProps {
  edited_carbs: number;
  edited_protein: number;
  edited_fat: number;
  edited_alcohol: number;
  record: MealRecord;
}

export default function calculateNutritionalInfo({
  edited_carbs,
  edited_protein,
  edited_fat,
  edited_alcohol,
  record,
}: CalculateNutritionalInfoProps) {
  const carbs = edited_carbs === 0 ? record.total_carbs : edited_carbs;
  const protein = edited_protein === 0 ? record.total_protein : edited_protein;
  const fat = edited_fat === 0 ? record.total_fat : edited_fat;
  const alcohol = edited_alcohol === 0 ? record.total_alcohol : edited_alcohol;
  const calorie =
    edited_carbs === 0 &&
    edited_protein === 0 &&
    edited_fat === 0 &&
    edited_alcohol === 0
      ? record!.total_calorie
      : 4 * carbs + 4 * protein + 9 * fat + 7 * alcohol;

  return [calorie, protein, carbs, fat];
}
