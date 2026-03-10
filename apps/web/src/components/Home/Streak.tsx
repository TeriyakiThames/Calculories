import Image from "next/image";

interface StreakProps {
  date?: number;
}

const StreakHeader = ({ date }: { date: number }) => (
  <span className="mt-1 flex items-center gap-1">
    <Image
      src="/Home/HoneyComb.svg"
      alt="Profile Icon"
      width={24}
      height={24}
    />
    <h1 className="text-l text-text font-bold">{date} Day Streak</h1>
  </span>
);

const StreakBody = ({ date }: { date: number }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const filledCount = date % 7 === 0 && date > 0 ? 7 : date % 7;

  return (
    <span className="my-3.5 flex justify-between">
      {days.map((day, i) => {
        const isFilled = i < filledCount;
        return (
          // Returns SVG for a circle with day in the middle
          <svg
            key={i}
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
              {day}
            </text>
          </svg>
        );
      })}
    </span>
  );
};

export default function Streak({ date = 0 }: StreakProps) {
  return (
    <div className="mx-auto flex w-[354.12px] flex-col gap-3 rounded-[9.5px] bg-white px-4 py-2 shadow-[0px_2.38px_2.38px_0px_rgba(0,0,0,0.25)]">
      <StreakHeader date={date} />
      <StreakBody date={date} />
    </div>
  );
}

Streak.Header = StreakHeader;
Streak.Body = StreakBody;
