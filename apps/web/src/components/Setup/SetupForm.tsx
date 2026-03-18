"use client";

import { Button } from "@/components/Shared/Button";
import { Input } from "@/components/Shared/Input";
import PageBottom from "@/components/Shared/PageBottom";
import { userSchema } from "@/constants/SetupSchema";
import { Locale, Messages } from "@calculories/shared-types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import DietaryRestrictions from "./DietaryRestrictions";
import GoalSelection from "./GoalSelection";
import { t } from "@/lib/internationalisation/i18n-helpers";

export default function SetupForm({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [goal, setGoal] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      console.log("Validation Failed:", formattedErrors);
      return;
    }

    setErrors({});
    console.log("Form Submitted Successfully:", validationResult.data);
    redirect(`/${locale}`);
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

      {/* TODO: Translate options */}
      <Input
        header={t("sex_header", messages)}
        placeholder={t("sex_placeholder", messages)}
        type="dropdown"
        options={["Male", "Female"]}
        backImageURL="/Icons/Dropdown.svg"
        value={sex}
        onChange={(val) => {
          setSex(val);
          validateField("sex", val);
        }}
        error={errors.sex}
      />

      {/* TODO: Translate options */}
      <Input
        header={t("activity_level_header", messages)}
        placeholder={t("activity_level_placeholder", messages)}
        type="dropdown"
        options={[
          "Sedentary (little to no exercise)",
          "Lightly active (1-3 days per week)",
          "Moderately active (3-5 days per week)",
          "Very active (5-7 days per week)",
          "Extra active (Very hard exercise or twice a day)",
        ]}
        backImageURL="/Icons/Dropdown.svg"
        value={activityLevel}
        onChange={(val) => {
          setActivityLevel(val);
          validateField("activityLevel", val);
        }}
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

      <div className="-mx-5 flex flex-col items-center gap-3 border-t border-[#8e8e93] bg-[#f6f7f7] px-9 pt-7">
        <Button type="submit">{t("Save and Continue", messages)}</Button>
        <Link
          href={`/${locale}`}
          className="text-grey-60 text-center text-[14px] transition-colors hover:text-green-100"
        >
          {t("Skip for now", messages)}
        </Link>
        <PageBottom />
      </div>
    </form>
  );
}
