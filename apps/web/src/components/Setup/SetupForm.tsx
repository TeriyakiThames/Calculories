"use client";

import { Button } from "@/components/Shared/Button";
import { Input } from "@/components/Shared/Input";
import { userSchema } from "@/constants/SetupSchema";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Locale, Messages } from "@calculories/shared-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DietaryRestrictions from "@/components/Setup/DietaryRestrictions";
import GoalSelection from "@/components/Setup/GoalSelection";

interface SetupFormProps {
  locale: Locale;
  messages: Messages;
}

export default function SetupForm({ locale, messages }: SetupFormProps) {
  const router = useRouter();

  // --- Form State ---
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState("");
  const [sexDisplay, setSexDisplay] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [activityLevelDisplay, setActivityLevelDisplay] = useState("");
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

  // --- Input Handlers ---
  const handleDateChange = (input: string) => {
    const numericValue = input.replace(/\D/g, "");
    let formattedDate = numericValue;

    if (numericValue.length > 2 && numericValue.length <= 4) {
      formattedDate = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    } else if (numericValue.length > 4) {
      formattedDate = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
    }

    setBirthdate(formattedDate);
    validateField("birthdate", formattedDate);
  };

  const handleNumberChange = (
    input: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: string,
  ) => {
    const numericValue = input
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    setter(numericValue);
    validateField(fieldName, numericValue);
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const rawData = {
      username,
      birthdate,
      weight,
      height,
      sex,
      activityLevel,
      dietary,
      goal,
    };

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

      // TODO: Replace this with your actual API call
      console.log("Data saved successfully:", validationResult.data);

      router.push(`/${locale}`);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Failed to save user data. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-3 flex max-w-md flex-col gap-9"
    >
      <Input
        header={t("username_header", messages)}
        placeholder={t("username_placeholder", messages)}
        type="text"
        value={username}
        onChange={(val) => {
          setUsername(val);
          validateField("username", val);
        }}
        error={errors.username}
      />

      <Input
        header={t("birthdate_header", messages)}
        placeholder={t("birthdate_placeholder", messages)}
        type="text"
        backImageURL="/Icons/Calendar.svg"
        value={birthdate}
        onChange={handleDateChange}
        error={errors.birthdate}
      />

      <div className="flex w-full justify-between gap-8">
        <div className="w-full">
          <Input
            header={t("weight_header", messages)}
            placeholder={t("weight_placeholder", messages)}
            type="text"
            value={weight}
            onChange={(val) => handleNumberChange(val, setWeight, "weight")}
            error={errors.weight}
          />
        </div>
        <div className="w-full">
          <Input
            header={t("height_header", messages)}
            placeholder={t("height_placeholder", messages)}
            type="text"
            value={height}
            onChange={(val) => handleNumberChange(val, setHeight, "height")}
            error={errors.height}
          />
        </div>
      </div>

      <Input
        header={t("sex_header", messages)}
        placeholder={t("sex_placeholder", messages)}
        type="dropdown"
        options={{ Male: t("male", messages), Female: t("female", messages) }}
        value={sex}
        onChange={(val) => {
          setSex(val);
          validateField("sex", val);
        }}
        onDropDownNameChange={(name) => setSexDisplay(name)}
        dropDownName={sexDisplay}
        error={errors.sex}
      />

      <Input
        header={t("activity_level_header", messages)}
        placeholder={t("activity_level_placeholder", messages)}
        type="dropdown"
        options={{
          Sedentary: t("sedentary", messages),
          LightlyActive: t("lightly_active", messages),
          ModeratelyActive: t("moderately_active", messages),
          VeryActive: t("very_active", messages),
          ExtraActive: t("extra_active", messages),
        }}
        value={activityLevel}
        onChange={(val) => {
          setActivityLevel(val);
          validateField("activityLevel", val);
        }}
        onDropDownNameChange={(name) => setActivityLevelDisplay(name)}
        dropDownName={activityLevelDisplay}
        error={errors.activityLevel}
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
