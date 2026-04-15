import { Reason } from "@calculories/shared-types";
import Image from "next/image";

function AiHeader() {
  return (
    <div className="flex items-center gap-3.5">
      <Image
        src="/Dish/AiSummary.svg"
        alt="AI Summary Icon"
        width={17}
        height={22}
      />
      <span className="text-grey-100 text-center text-lg font-bold">
        Why this works for you
      </span>
    </div>
  );
}

interface AiBodyProps {
  title: string;
  body: string;
  emoji: string;
}

function AiBody({ title, body, emoji }: AiBodyProps) {
  return (
    <div className="text-grey-100 flex">
      <p className="text-3xl">{emoji}</p>
      <div>
        <h1 className="text-sm font-bold">{title}</h1>
        <p className="text-xs">{body}</p>
      </div>
    </div>
  );
}

// TODO: Add props to bring in data from recommender
export function AiSummary({ reasons }: { reasons: Reason[] }) {
  return (
    <div className="bg-green-10 border-green-40 flex flex-col gap-2.5 rounded-xl border px-4 py-5">
      <AiHeader />
      {reasons.map((r) => {
        return (
          <AiBody
            title={r.type}
            body={r.explanation}
            key={r.type}
            emoji={r.emoji}
          />
        );
      })}
    </div>
  );
}
