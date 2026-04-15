import { t } from "@/lib/internationalisation/i18n-helpers";
import { Messages } from "@calculories/shared-types";

// --- Format Helpers ---
export const getLevelFromMultiplier = (val?: string | number) => {
  if (!val) return "";
  const num = Number(val);
  if (num === 1.2) return "Sedentary";
  if (num === 1.375) return "LightlyActive";
  if (num === 1.55) return "ModeratelyActive";
  if (num === 1.725) return "VeryActive";
  if (num === 1.9) return "ExtraActive";
  return String(num); // Fallback
};

export const getMultiplierFromLevel = (val?: string) => {
  if (!val) return undefined;
  const map: Record<string, number> = {
    Sedentary: 1.2,
    LightlyActive: 1.375,
    ModeratelyActive: 1.55,
    VeryActive: 1.725,
    ExtraActive: 1.9,
  };
  return map[val] || Number(val);
};

export const formatDateForUI = (dateStr?: string) => {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr;

  const dateOnly = dateStr.split("T")[0];
  const [year, month, day] = dateOnly.split("-");

  if (year && month && day)
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;

  return dateStr;
};

export const formatDateForAPI = (dateStr?: string) => {
  if (!dateStr) return "";

  if (dateStr.includes("-")) {
    const dateOnly = dateStr.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    if (year && month && day)
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    return dateStr;
  }

  const [day, month, year] = dateStr.split("/");
  if (year && month && day)
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return dateStr;
};

export const getActivityLevelLabel = (
  level?: string | number,
  messages?: Messages,
) => {
  if (!level) return "";
  const levelStr = String(level);

  const keyMap: Record<string, string> = {
    Sedentary: "sedentary",
    LightlyActive: "lightly_active",
    ModeratelyActive: "moderately_active",
    VeryActive: "very_active",
    ExtraActive: "extra_active",
  };

  const translationKey = keyMap[levelStr];

  if (!translationKey) return levelStr;
  return t(translationKey, messages || {}) || translationKey;
};

export const getSexLabel = (sex?: string, messages?: Messages) => {
  if (!sex) return "";
  const translated = t(sex, messages || {});
  return translated || sex.charAt(0).toUpperCase() + sex.slice(1);
};
