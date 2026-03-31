import { Messages } from "@calculories/shared-types";
import { t } from "@/lib/internationalisation/i18n-helpers";
import BackButton from "@/components/Shared/BackButton";

interface PageTitleProps {
  messages: Messages;
  titleOnly?: boolean;
}

export default function PageTitle({ messages, titleOnly }: PageTitleProps) {
  return (
    <div className="mb-12.5 flex w-full items-center justify-between pt-7.5">
      <BackButton
        containerClassName={`w-14.5 ${!titleOnly ? "invisible" : ""}`}
      />
      <h1 className="text-grey-100 text-2xl font-bold">
        {t("Title", messages)}
      </h1>
      <BackButton containerClassName="w-14.5 invisible" />
    </div>
  );
}
