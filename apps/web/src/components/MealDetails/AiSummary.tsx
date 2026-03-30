import Image from "next/image";

function AiHeader() {
  return (
    <div className="flex items-center gap-3.5 self-center">
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
}

function AiBody({ title, body }: AiBodyProps) {
  return (
    <div className="text-grey-100">
      <h1 className="text-sm font-bold">{title}</h1>
      <p className="text-xs">{body}</p>
    </div>
  );
}

// TODO: Add props to bring in data from recommender
export function AiSummary() {
  return (
    <div className="bg-green-10 border-green-40 flex flex-col gap-2.5 rounded-xl border px-4 py-5">
      <AiHeader />
      <AiBody
        title={"High Protein"}
        body={"Supports your muscle recovery goal."}
      />
      <AiBody
        title={"Low Glycemic"}
        body={"Quinoa base prevents blood sugar spikes."}
      />
      <AiBody
        title={"High Satiety"}
        body={"Fiber-rich avocado keeps you full longer."}
      />
    </div>
  );
}
