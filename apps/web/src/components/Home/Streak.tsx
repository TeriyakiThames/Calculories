import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { DietProfile, Messages } from "@calculories/shared-types";

interface StreakProps {
  dietProfile: DietProfile;
  messages: Messages;
}

const StreakHeader = ({
  streak,
  messages,
}: {
  streak: number;
  messages: Messages;
}) => (
  <span className="mt-1 flex items-center gap-1">
    <Image
      src="/Home/HoneyComb.svg"
      alt={"Honeycomb icon"}
      width={24}
      height={24}
    />
    <h1 className="text-l text-text font-bold">
      {streak} {t("streak", messages)}
    </h1>
  </span>
);

const StreakBody = ({
  streak,
  messages,
}: {
  streak: number;
  messages: Messages;
}) => {
  const dayKeys = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];
  const filledCount = streak % 7 === 0 && streak > 0 ? 7 : streak % 7;

  return (
    <span className="mb-2 flex justify-between">
      {dayKeys.map((key, i) => {
        const isFilled = i < filledCount;
        return (
          <svg
            key={key}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="32"
              height="32"
              rx="16"
              fill={isFilled ? "#4AAE9B" : "#d9d9d9"}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill={isFilled ? "white" : "#727272"}
              className="text-[12px] font-bold uppercase"
            >
              {t(key, messages)}
            </text>
          </svg>
        );
      })}
    </span>
  );
};

export default function Streak({ dietProfile, messages }: StreakProps) {
  const streak = dietProfile?.streak || 0;

  return (
    <div className="mx-auto flex w-[354.12px] flex-col gap-3 rounded-xl border-[0.5] border-[#bebdbb] bg-white px-4 py-2 shadow-[0px_2.38px_2.38px_0px_rgba(0,0,0,0.25)]">
      <StreakHeader streak={streak} messages={messages} />
      <StreakBody streak={streak} messages={messages} />
    </div>
  );
}
