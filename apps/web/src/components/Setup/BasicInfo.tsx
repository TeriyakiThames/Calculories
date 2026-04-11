"use client";

import { Input } from "@/components/Shared/Input";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Messages } from "@calculories/shared-types";

interface BasicInfoData {
  username: string;
  birthdate: string;
  weight: string;
  height: string;
  sex: string;
  sexDisplay: string;
  activityLevel: string;
  activityLevelDisplay: string;
}

interface BasicInfoProps {
  data: BasicInfoData;
  onUpdate: (updates: Partial<BasicInfoData>) => void;
  errors: Record<string, string>;
  messages: Messages;
}

export default function BasicInfo({
  data,
  onUpdate,
  errors,
  messages,
}: BasicInfoProps) {
  // --- Local Input Handlers ---
  const handleDateChange = (input: string) => {
    const numericValue = input.replace(/\D/g, "");
    let formattedDate = numericValue;

    if (numericValue.length > 2 && numericValue.length <= 4) {
      formattedDate = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    } else if (numericValue.length > 4) {
      formattedDate = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
    }
    onUpdate({ birthdate: formattedDate });
  };

  const handleNumberChange = (
    input: string,
    fieldName: keyof BasicInfoData,
  ) => {
    const numericValue = input
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    onUpdate({ [fieldName]: numericValue });
  };

  return (
    <div className="flex flex-col gap-9">
      <Input
        header={t("username_header", messages)}
        placeholder={t("username_placeholder", messages)}
        type="text"
        value={data.username}
        onChange={(val) => onUpdate({ username: val })}
        error={errors.username}
      />

      <Input
        header={t("birthdate_header", messages)}
        placeholder={t("birthdate_placeholder", messages)}
        type="text"
        backImageURL="/Icons/Calendar.svg"
        value={data.birthdate}
        onChange={handleDateChange}
        error={errors.birthdate}
      />

      <div className="flex w-full justify-between gap-8">
        <div className="w-full">
          <Input
            header={t("weight_header", messages)}
            placeholder={t("weight_placeholder", messages)}
            type="text"
            value={data.weight}
            onChange={(val) => handleNumberChange(val, "weight")}
            error={errors.weight}
          />
        </div>
        <div className="w-full">
          <Input
            header={t("height_header", messages)}
            placeholder={t("height_placeholder", messages)}
            type="text"
            value={data.height}
            onChange={(val) => handleNumberChange(val, "height")}
            error={errors.height}
          />
        </div>
      </div>

      <Input
        header={t("sex_header", messages)}
        placeholder={t("sex_placeholder", messages)}
        type="dropdown"
        options={{ Male: t("male", messages), Female: t("female", messages) }}
        value={data.sex}
        onChange={(val) => onUpdate({ sex: val })}
        onDropDownNameChange={(name) => onUpdate({ sexDisplay: name })}
        dropDownName={data.sexDisplay}
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
        value={data.activityLevel}
        onChange={(val) => onUpdate({ activityLevel: val })}
        onDropDownNameChange={(name) =>
          onUpdate({ activityLevelDisplay: name })
        }
        dropDownName={data.activityLevelDisplay}
        error={errors.activityLevel}
      />
    </div>
  );
}
