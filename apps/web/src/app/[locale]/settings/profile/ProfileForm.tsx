"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Button } from "@/components/Shared/Button";
import BasicInfo from "@/components/Setup/BasicInfo";
import { Messages, t } from "@/lib/internationalisation/i18n-helpers";
import { userSchema } from "@/constants/SetupSchema";
import { UpdateUserDto, Sex } from "@calculories/shared-types";

import useUser from "@/hooks/useUser";
import updateUser from "@/services/api/updateUser";
import {
  getLevelFromMultiplier,
  formatDateForUI,
  getSexLabel,
  getActivityLevelLabel,
  formatDateForAPI,
  getMultiplierFromLevel,
} from "@/services/formatHelpers";

interface ProfileFormProps {
  initialData: UpdateUserDto | undefined;
  messages: Messages;
}

type ProfileFormData = {
  username: string;
  birthdate: string;
  weight: string;
  height: string;
  sex: string;
  sexDisplay: string;
  activityLevel: string;
  activityLevelDisplay: string;
};

export default function ProfileForm({
  initialData,
  messages,
}: ProfileFormProps) {
  const router = useRouter();
  const { user: authUser } = useUser();

  const initialActivityLevel = getLevelFromMultiplier(
    initialData?.activity_level,
  );

  // --- Form State ---
  const [formData, setFormData] = useState<ProfileFormData>({
    username: initialData?.username || "",
    birthdate: formatDateForUI(initialData?.dob),
    weight:
      initialData?.weight !== undefined && initialData?.weight !== null
        ? String(initialData.weight)
        : "",
    height:
      initialData?.height !== undefined && initialData?.height !== null
        ? String(initialData.height)
        : "",
    sex: initialData?.sex || "",
    sexDisplay: getSexLabel(initialData?.sex, messages),
    activityLevel: initialActivityLevel,
    activityLevelDisplay: getActivityLevelLabel(initialActivityLevel, messages),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Validation Logic ---
  const validateField = (field: string, value: string) => {
    const fieldSchema =
      userSchema.shape[field as keyof typeof userSchema.shape];

    if (fieldSchema) {
      const isNumeric = ["weight", "height"].includes(field);
      const parsedValue = isNumeric && value !== "" ? Number(value) : value;

      const result = fieldSchema.safeParse(parsedValue);

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

  const handleUpdateBasicInfo = (updates: Partial<ProfileFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      Object.keys(updates).forEach((key) => {
        validateField(key, newData[key as keyof ProfileFormData]);
      });
      return newData;
    });
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const dataToValidate = {
      username: formData.username,
      birthdate: formData.birthdate,
      sex: formData.sex,
      weight: formData.weight !== "" ? Number(formData.weight) : undefined,
      height: formData.height !== "" ? Number(formData.height) : undefined,
      activityLevel: formData.activityLevel,
    };

    const profileSchema = userSchema.pick({
      username: true,
      birthdate: true,
      sex: true,
      weight: true,
      height: true,
      activityLevel: true,
    });

    const validationResult = profileSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const flatErrors: Record<string, string> = {};

      validationResult.error.issues.forEach((issue) => {
        const uiKey = String(issue.path[0]);
        flatErrors[uiKey] = issue.message;
      });

      setErrors(flatErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const payload: UpdateUserDto = {};

      if (formData.username) payload.username = formData.username;

      const formattedDate = formatDateForAPI(formData.birthdate);
      if (formattedDate) payload.dob = formattedDate;

      if (formData.sex) payload.sex = formData.sex as Sex;

      if (formData.weight !== "") payload.weight = Number(formData.weight);
      if (formData.height !== "") payload.height = Number(formData.height);

      if (formData.activityLevel) {
        const parsed = getMultiplierFromLevel(formData.activityLevel);
        if (typeof parsed === "number" && !isNaN(parsed)) {
          payload.activity_level = parsed;
        }
      }

      await updateUser(payload);

      if (authUser?.id) {
        await mutate(`user-profile-${authUser.id}`);
      }

      router.back();
      router.refresh();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save profile.";
      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-1 flex-col justify-between pb-24"
    >
      <BasicInfo
        data={formData}
        onUpdate={handleUpdateBasicInfo}
        errors={errors}
        messages={messages}
      />

      <div className="border-grey-40 bg-background-10 fixed bottom-0 left-1/2 z-10 flex w-full max-w-105 -translate-x-1/2 flex-col items-center gap-3 border-t px-9 py-5">
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
