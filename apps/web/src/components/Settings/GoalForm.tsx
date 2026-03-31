"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Shared/Button";
import GoalSelection from "@/components/Setup/GoalSelection";
import { Messages, t } from "@/lib/internationalisation/i18n-helpers";
import { Locale } from "@calculories/shared-types";
import { userSchema } from "@/constants/SetupSchema";

interface GoalFormProps {
  initialGoal: string;
  messages: Messages;
  locale: Locale;
}

export default function GoalForm({
  initialGoal,
  messages,
  locale,
}: GoalFormProps) {
  const router = useRouter();

  // --- Form State ---
  const [goal, setGoal] = useState(initialGoal);

  // --- UI State ---
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Validation Logic ---
  const validateField = (field: string, value: string) => {
    const fieldSchema =
      userSchema.shape[field as keyof typeof userSchema.shape];

    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (!result.success) {
          newErrors[field] = result.error.issues[0].message;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate only the goal field from the shared schema
    const validationResult = userSchema.shape.goal.safeParse(goal);

    if (!validationResult.success) {
      setErrors({ goal: validationResult.error.issues[0].message });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // --- TODO: Replace with actual Supabase / API logic ---
      console.log("Goal saved successfully:", goal);
      // Simulate network latency for mock testing
      await new Promise((resolve) => setTimeout(resolve, 800));
      // ------------------------------------------------------

      router.push(`/${locale}/settings`);
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Failed to save goal. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-10">
      <GoalSelection
        value={goal}
        onChange={(val) => {
          setGoal(val);
          validateField("goal", val);
        }}
        error={errors.goal}
        messages={messages}
      />

      <div className="border-grey-40 bg-background-10 -mx-5 flex flex-col items-center gap-3 border-t px-9 pt-7">
        {errors.submit && (
          <p className="mb-2 text-sm text-red-100">{errors.submit}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("saving", messages)
            : t("Save and Continue", messages)}
        </Button>
      </div>
    </form>
  );
}
