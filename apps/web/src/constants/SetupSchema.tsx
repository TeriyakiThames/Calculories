import { z } from "zod";

export const SEX_OPTIONS = ["Male", "Female", "Other"] as const;

export const ACTIVITY_LEVEL_OPTIONS = [
  "Sedentary",
  "LightlyActive",
  "ModeratelyActive",
  "VeryActive",
  "ExtraActive",
] as const;

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Halal Diet",
  "Lactose Intolerance",
  "Gluten Intolerance",
  "Peanut Allergy",
  "Shellfish Allergy",
] as const;

export const GOAL_OPTIONS = [
  "Balanced",
  "Moderate",
  "HighProtein",
  "Ketogenic",
] as const;

export const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain English letters and numbers, with no spaces or special characters.",
    ),

  birthdate: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Must be in DD/MM/YYYY format!",
    )
    .refine(
      (val) => {
        const [day, month, year] = val.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      },
      { message: "This date does not exist." },
    )
    .refine(
      (val) => {
        const year = Number(val.split("/")[2]);
        const currentYear = new Date().getFullYear();
        return year >= currentYear - 100 && year <= currentYear - 5;
      },
      { message: "Please enter a year in the valid range." },
    ),

  weight: z.coerce
    .number({
      message: "Weight must be a valid number!",
    })
    .multipleOf(0.1, "Weight can only have one decimal place.")
    .min(15, "Weight must be at least 15kg!")
    .max(700, "Weight cannot exceed 700kg!"),

  height: z.coerce
    .number({
      message: "Height must be a valid number!",
    })
    .multipleOf(0.1, "Height can only have one decimal place.")
    .min(50, "Height must be at least 50cm!")
    .max(275, "Height cannot exceed 275cm!"),

  sex: z.enum(SEX_OPTIONS, {
    message: "Please select a sex!",
  }),

  activityLevel: z.enum(ACTIVITY_LEVEL_OPTIONS, {
    message: "Please select an activity level!",
  }),

  dietary: z.array(z.enum(DIETARY_OPTIONS)).optional(),

  goal: z.enum(GOAL_OPTIONS, {
    message: "Please select a goal!",
  }),
});

export type SetupFormData = z.infer<typeof userSchema>;
