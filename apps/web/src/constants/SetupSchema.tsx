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
    .min(3, "error_username_min_len")
    .max(30, "error_username_max_len")
    .regex(/^[a-zA-Z0-9\u0E00-\u0E7F ]+$/, "error_username_format"),

  birthdate: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "error_dob_format",
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
      { message: "error_dob_does_not_exist" },
    )
    .refine(
      (val) => {
        const year = Number(val.split("/")[2]);
        const currentYear = new Date().getFullYear();
        return year >= currentYear - 100 && year <= currentYear - 5;
      },
      { message: "error_dob_invalid_range" },
    ),

  weight: z.coerce
    .number({
      message: "error_weight_not_num",
    })
    .multipleOf(0.1, "error_weight_decimal")
    .min(15, "error_weight_min")
    .max(700, "error_weight_max"),

  height: z.coerce
    .number({
      message: "error_height_not_num",
    })
    .multipleOf(0.1, "error_height_decimal")
    .min(50, "error_height_min")
    .max(275, "error_height_max"),

  sex: z.enum(SEX_OPTIONS, {
    message: "error_sex_select",
  }),

  activityLevel: z.enum(ACTIVITY_LEVEL_OPTIONS, {
    message: "error_activity_level_select",
  }),

  dietary: z.array(z.enum(DIETARY_OPTIONS)).optional(),

  goal: z.enum(GOAL_OPTIONS, {
    message: "error_goal_select",
  }),
});

export type SetupFormData = z.infer<typeof userSchema>;
