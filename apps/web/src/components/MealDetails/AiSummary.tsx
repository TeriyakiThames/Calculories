import { Messages, Reason } from "@calculories/shared-types";
import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";

function AiHeader({ messages }: { messages: Messages }) {
  return (
    <div className="flex items-center gap-3.5">
      <Image
        src="/Dish/AiSummary.svg"
        alt="AI Summary Icon"
        width={17}
        height={22}
      />
      <span className="text-grey-100 text-center text-lg font-bold">
        {t("why_this_works_for_you", messages)}
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
    <div className="text-grey-100 flex gap-2">
      <p className="text-3xl">{emoji}</p>
      <div>
        <h1 className="text-sm font-bold">{title}</h1>
        <p className="text-xs">{body}</p>
      </div>
    </div>
  );
}

function AiSummarySkeleton({ messages }: { messages: Messages }) {
  return (
    <div className="bg-green-10 border-green-40 flex flex-col gap-2.5 rounded-xl border px-4 py-5">
      <div className="flex items-center gap-3.5">
        <Image
          src="/Dish/AiSummary.svg"
          alt="AI Summary Icon"
          width={17}
          height={22}
        />
        <span className="text-grey-100 text-center text-lg font-bold">
          {t("why_this_works_for_you", messages)}
        </span>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-grey-100 flex gap-2">
          <div className="bg-green-20 h-10 w-12 animate-pulse rounded-md"></div>
          <div className="flex w-full flex-col gap-2">
            <h1 className="bg-green-20 w-32 animate-pulse rounded-sm py-2"></h1>
            <div className="flex animate-pulse flex-col gap-1 rounded-sm">
              <p className="bg-green-20 w-full animate-pulse rounded-sm py-1.5"></p>
              <p className="bg-green-20 w-16 animate-pulse rounded-sm py-1.5"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AiSummary({
  reasons,
  messages,
}: {
  reasons: Reason[] | undefined;
  messages: Messages;
}) {
  if (!reasons) {
    return <AiSummarySkeleton messages={messages} />;
  }

  return (
    <div className="bg-green-10 border-green-40 flex flex-col gap-2.5 rounded-xl border px-4 py-5">
      <AiHeader messages={messages} />
      {reasons.map((r) => {
        return (
          <AiBody
            title={t(r.type, messages)}
            body={r.explanation}
            key={r.type}
            emoji={r.emoji}
          />
        );
      })}
    </div>
  );
}
