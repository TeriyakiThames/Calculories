import { Locale, Messages } from "@calculories/shared-types";
import LocaleSwitcher from "@/components/Shared/LocaleSwitcher";
import { t } from "@/lib/internationalisation/i18n-helpers";
import BackButton from "@/components/Shared/BackButton";

export default function SetupTitle({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <div className="mb-12.5 flex w-full items-center justify-between pt-7.5">
      <BackButton containerClassName="w-14.5" />
      <h1 className="text-grey-100 text-2xl font-bold">
        {t("Quick Setup", messages)}
      </h1>

      <LocaleSwitcher locale={locale} />
    </div>
  );
}
