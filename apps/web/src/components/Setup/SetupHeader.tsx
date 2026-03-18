import { t } from "@/lib/internationalisation/i18n-helpers";
import { Messages } from "@calculories/shared-types";

export default function SetupHeader({ messages }: { messages: Messages }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-grey-100 text-xl font-bold">
        {t("Title", messages)}
      </h1>
      <h2 className="text-grey-80 leading-5">{t("Subtitle", messages)}</h2>
      <p className="text-grey-80 text-center text-xs leading-3.75 italic">
        {t("Note", messages)}
      </p>
    </div>
  );
}
