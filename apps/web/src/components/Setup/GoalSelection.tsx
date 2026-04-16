import { Messages } from "@calculories/shared-types";
import { InputHeader } from "../Shared/Input";
import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { useState, Fragment } from "react";
import Popup from "../Shared/Popup";
import { Button } from "../Shared/Button";
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
  const [openItem, setOpenItem] = useState<string | null>(null);

  const GOALS = [
    {
      id: "Balanced",
      label: t("Balanced", messages),
      detail: t("Balanced_detail", messages),
    },
    {
      id: "Moderate",
      label: t("Moderate", messages),
      detail: t("Moderate_detail", messages),
    },
    {
      id: "HighProtein",
      label: t("High Protein", messages),
      detail: t("High Protein_detail", messages),
    },
    {
      id: "Ketogenic",
      label: t("Ketogenic", messages),
      detail: t("Ketogenic_detail", messages),
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <InputHeader header={t("goal_header", messages)} />

      <div className="mt-1 grid w-80 grid-cols-2 gap-4 self-center">
        {GOALS.map((item) => {
          const isActive = value === item.id;

          return (
            <Fragment key={item.id}>
              <button
                type="button"
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`relative flex flex-col items-center justify-center rounded-2xl border p-6 transition-colors ${
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

                <Image
                  src={"/Setup/Info.svg"}
                  alt="More Details Icon"
                  width={18}
                  height={18}
                  className="absolute right-2 bottom-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenItem(item.id);
                  }}
                />
              </button>

              {openItem === item.id && (
                <Popup onClickOutside={() => setOpenItem(null)}>
                  <div className="relative flex w-full flex-col items-center">
                    <button
                      onClick={() => setOpenItem(null)}
                      title="Close"
                      className="hover:text-grey-100 hover:bg-grey-10 absolute top-0 right-0 -m-3 self-end rounded-full p-2 hover:cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#182230" // text-grey-60
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x-icon lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                    <Image
                      src={`/Setup/${item.id}.svg`}
                      alt={`${item.label} Icon`}
                      width={50}
                      height={50}
                    />
                    <span className="text-3xl leading-tight font-bold">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-grey-80 text-sm leading-tight">
                    {item.detail}
                  </span>
                  <Button
                    className="mt-1 h-14!"
                    onClick={() => setOpenItem(null)}
                  >
                    Got it
                  </Button>
                </Popup>
              )}
            </Fragment>
          );
        })}
      </div>

      {error && (
        <p className="text-xs leading-3.5 font-normal text-red-100">{error}</p>
      )}
    </div>
  );
}
