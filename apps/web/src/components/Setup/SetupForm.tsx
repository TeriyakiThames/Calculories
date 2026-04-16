"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Shared/Button";
import { userSchema } from "@/constants/SetupSchema";
import { t } from "@/lib/internationalisation/i18n-helpers";
import {
  GetUserResponse,
  Goal,
  Locale,
  Messages,
  Sex,
  UpdateUserDto,
} from "@calculories/shared-types";
import BasicInfo from "@/components/Setup/BasicInfo";
import DietaryRestrictions from "@/components/Setup/DietaryRestrictions";
import GoalSelection from "@/components/Setup/GoalSelection";
import updateUser from "@/services/api/updateUser";
import { mutate } from "swr";
import useUser from "@/hooks/useUser";
import getUser from "@/services/api/getUser";
import {
  formatDateForUI,
  getSexLabel,
  getActivityLevelLabel,
  getLevelFromMultiplier,
} from "@/services/formatHelpers";

interface SetupFormProps {
  locale: Locale;
  messages: Messages;
}

export default function SetupForm({ locale, messages }: SetupFormProps) {
  const { user: authUser } = useUser();

  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    birthdate: "",
    weight: "",
    height: "",
    sex: "",
    sexDisplay: "",
    activityLevel: "",
    activityLevelDisplay: "",
  });

  const [dietary, setDietary] = useState<string[]>([]);
  const [goal, setGoal] = useState("");

  // --- UI State ---
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Validation Logic ---
  const validateField = (field: string, value: string | string[]) => {
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

  const handleUpdateBasicInfo = (updates: Partial<typeof formData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      Object.keys(updates).forEach((key) => {
        validateField(key, newData[key as keyof typeof formData]);
      });
      return newData;
    });
  };

  const parseSafeFloat = (val: string) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? undefined : parsed;
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const rawData = { ...formData, dietary, goal };
    const validationResult = userSchema.safeParse(rawData);

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        formattedErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      let isoDob: string | undefined;
      if (formData.birthdate.includes("/")) {
        const [day, month, year] = formData.birthdate.split("/");
        isoDob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      const activityLevelMap: Record<string, number> = {
        Sedentary: 1.2,
        LightlyActive: 1.375,
        ModeratelyActive: 1.55,
        VeryActive: 1.725,
        ExtraActive: 1.9,
      };

      const updatePayload: UpdateUserDto = {
        username: formData.username || undefined,
        dob: isoDob,
        sex: formData.sex as Sex,
        weight: parseSafeFloat(formData.weight),
        height: parseSafeFloat(formData.height),
        activity_level: activityLevelMap[formData.activityLevel] || undefined,
        goal: goal as Goal,
        vegetarian_default: dietary.includes("Vegetarian"),
        halal_default: dietary.includes("Halal Diet"),
        no_lactose_default: dietary.includes("Lactose Intolerance"),
        gluten_free_default: dietary.includes("Gluten Intolerance"),
        no_peanut_default: dietary.includes("Peanut Allergy"),
        no_shellfish_default: dietary.includes("Shellfish Allergy"),
        is_setup_finished: true,
      };

      const cleanPayload = Object.fromEntries(
        Object.entries(updatePayload).filter(([_, v]) => v !== undefined),
      );

      await updateUser(cleanPayload as UpdateUserDto);

      if (authUser?.id) {
        await mutate(`user-profile-${authUser.id}`);
      }

      router.push(`/${locale}`);
    } catch (error: unknown) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("error_saving", messages);
      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const initialData: GetUserResponse = await getUser();
      setFormData({
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
        activityLevel: getLevelFromMultiplier(initialData?.activity_level),
        activityLevelDisplay: getActivityLevelLabel(
          getLevelFromMultiplier(initialData?.activity_level),
          messages,
        ),
      });
      if (initialData.vegetarian_default)
        setDietary((prev) => [...prev, "Vegetarian"]);
      if (initialData.halal_default)
        setDietary((prev) => [...prev, "Halal Diet"]);
      if (initialData.no_lactose_default)
        setDietary((prev) => [...prev, "Lactose Intolerance"]);
      if (initialData.gluten_free_default)
        setDietary((prev) => [...prev, "Gluten Intolerance"]);
      if (initialData.no_peanut_default)
        setDietary((prev) => [...prev, "Peanut Allergy"]);
      if (initialData.no_shellfish_default)
        setDietary((prev) => [...prev, "Shellfish Allergy"]);
      setGoal(initialData.goal);
    };
    getUserInfo();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-3 flex max-w-md flex-col gap-9"
    >
      <BasicInfo
        data={formData}
        onUpdate={handleUpdateBasicInfo}
        errors={errors}
        messages={messages}
      />

      <DietaryRestrictions
        value={dietary}
        onChange={(val) => {
          setDietary(val);
          validateField("dietary", val);
        }}
        messages={messages}
      />

      <GoalSelection
        value={goal}
        onChange={(val) => {
          setGoal(val);
          validateField("goal", val);
        }}
        error={errors.goal}
        messages={messages}
      />

      {Object.entries(errors).length !== 0 && (
        <div className="text-red-100">
          Please correctly fill out all the fields
        </div>
      )}
      <div className="pb-5" />

      <div className="border-grey-40 bg-background-10 fixed bottom-0 left-1/2 z-10 flex w-full max-w-105 -translate-x-1/2 flex-col items-center gap-3 border-t px-9 py-5">
        {errors.submit && (
          <p className="mb-2 text-sm text-red-100">{errors.submit}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("saving", messages)
            : t("Save and Continue", messages)}
        </Button>

        <Link
          href={`/${locale}`}
          className={`text-grey-60 text-center text-[14px] transition-colors hover:text-green-100 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {t("Skip for now", messages)}
        </Link>
      </div>
    </form>
  );
}
