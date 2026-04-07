import { z } from "zod";

export const SEX_OPTIONS = ["Male", "Female"] as const;

export const ACTIVITY_LEVEL_OPTIONS = [
  "Sedentary (little to no exercise)",
  "Lightly active (1-3 days per week)",
  "Moderately active (3-5 days per week)",
  "Very active (5-7 days per week)",
  "Extra active (Very hard exercise or twice a day)",
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
    .min(1, "Username must be more than 1 character and in English!"),

  birthdate: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Must be in DD/MM/YYYY format!",
    ),

  weight: z.coerce.number().positive("Weight must be a number greater than 0!"),

  height: z.coerce.number().positive("Height must be a number greater than 0!"),

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
