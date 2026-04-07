"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Button } from "@/components/Shared/Button";
import GoalSelection from "@/components/Setup/GoalSelection";
import { Messages, t } from "@/lib/internationalisation/i18n-helpers";
import { Locale, Goal } from "@calculories/shared-types";
import { userSchema } from "@/constants/SetupSchema";

// Real API & Hooks
import useUser from "@/hooks/useUser";
import updateUser from "@/services/api/updateUser";

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
  const { user: authUser } = useUser();

  // --- Form State ---
  // Explicitly cast initialGoal to the Goal type to satisfy the API requirements
  const [goal, setGoal] = useState<Goal>(initialGoal as Goal);

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

      // Call actual API service
      await updateUser({ goal });

      // Invalidate the cache to ensure the UI updates everywhere
      if (authUser?.id) {
        await mutate(`user-profile-${authUser.id}`);
      }

      // Navigate back 1 page as requested
      router.back();
      // Optional: router.refresh() forces the server to re-sync if necessary
      router.refresh();
    } catch (error: unknown) {
      console.error("Submission error:", error);

      // Safely extract error message without using 'any'
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save goal. Please try again.";

      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-1 flex-col justify-between"
    >
      <GoalSelection
        value={goal}
        onChange={(val) => {
          // Cast the selection value to Goal type
          const selectedGoal = val as Goal;
          setGoal(selectedGoal);
          validateField("goal", selectedGoal);
        }}
        error={errors.goal}
        messages={messages}
      />

      <div className="border-grey-40 bg-background-10 sticky bottom-0 z-10 -mx-5 mt-auto flex flex-col items-center gap-3 border-t px-9 py-5">
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
