import { InputHeader } from "@/components/Shared/Input";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Messages } from "@calculories/shared-types";

interface DietaryRestrictionsProps {
  value?: string[];
  onChange: (value: string[]) => void;
  messages: Messages;
}

export default function DietaryRestrictions({
  value = [],
  onChange,
  messages,
}: DietaryRestrictionsProps) {
  const DIETARY_OPTIONS = [
    { id: "Vegetarian", label: t("Vegetarian", messages) },
    { id: "Halal Diet", label: t("Halal Diet", messages) },
    { id: "Lactose Intolerance", label: t("Lactose Intolerance", messages) },
    { id: "Gluten Intolerance", label: t("Gluten Intolerance", messages) },
    { id: "Peanut Allergy", label: t("Peanut Allergy", messages) },
    { id: "Shellfish Allergy", label: t("Shellfish Allergy", messages) },
  ];

  const toggleOption = (id: string) => {
    if (!onChange) return;

    if (value.includes(id)) {
      const updatedArray = value.filter((item) => item !== id);
      onChange(updatedArray);
    } else {
      const updatedArray = [...value, id];
      onChange(updatedArray);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <InputHeader
        header={t("dietary_header", messages)}
        subheader={t("dietary_subheader", messages)}
      />

      <div className="mt-1 flex w-80 flex-wrap gap-4">
        {DIETARY_OPTIONS.map((option) => {
          const isActive = value.includes(option.id);

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`rounded-[40px] border px-4.5 py-3 text-center text-xs transition-colors ${
                isActive
                  ? "bg-green-10 border-green-100 text-green-100"
                  : "bg-background-1 text-grey-60 border-[#CAE1DD] hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
