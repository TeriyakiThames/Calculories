import { Messages } from "@calculories/shared-types";
import { InputHeader } from "../Shared/Input";
import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";

interface GoalSelectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  messages: Messages;
}

export default function GoalSelection({
  value = "",
  onChange,
  error = "",
  messages,
}: GoalSelectionProps) {
  const GOALS = [
    { id: "balanced", label: t("Balanced", messages) },
    { id: "moderate", label: t("Moderate", messages) },
    { id: "protein", label: t("High Protein", messages) },
    { id: "keto", label: t("Ketogenic", messages) },
  ];

  return (
    <div className="flex flex-col gap-2">
      <InputHeader header={t("goal_header", messages)} />

      <div className="mt-1 grid w-80 grid-cols-2 gap-4 self-center">
        {GOALS.map((item) => {
          const isActive = value === item.id;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center rounded-2xl border p-6 transition-colors ${
                isActive
                  ? "bg-green-10 border-green-100 text-green-100"
                  : "text-grey-60 border-[#CAE1DD] bg-white hover:bg-gray-50"
              }`}
            >
              <Image
                src={`/Setup/${item.id}.svg`}
                alt={`${item.label} Icon`}
                width={24}
                height={24}
                className="mb-2"
              />
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs leading-3.5 font-normal text-red-100">{error}</p>
      )}
    </div>
  );
}
