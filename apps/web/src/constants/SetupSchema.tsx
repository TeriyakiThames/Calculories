import { z } from "zod";

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

  height: z.coerce
    .number()
    .positive("Height must be a number  greater than 0!"),

  sex: z.enum(["Male", "Female"], {
    message: "Please select a sex!",
  }),

  activityLevel: z.enum(
    [
      "Sedentary (little to no exercise)",
      "Lightly active (1-3 days per week)",
      "Moderately active (3-5 days per week)",
      "Very active (5-7 days per week)",
      "Extra active (Very hard exercise or twice a day)",
    ],
    {
      message: "Please select an activity level!",
    },
  ),

  dietary: z
    .array(
      z.enum([
        "Vegetarian",
        "Halal Diet",
        "Lactose Intolerance",
        "Gluten Intolerance",
        "Peanut Allergy",
        "Shellfish Allergy",
      ]),
    )
    .optional(),

  goal: z.enum(["balanced", "moderate", "protein", "keto"], {
    message: "Please select a goal!",
  }),
});
