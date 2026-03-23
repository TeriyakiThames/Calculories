import { Locale, Messages } from "@calculories/shared-types";
import LocaleSwitcher from "@/components/Shared/LocaleSwitcher";
import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";
import Link from "next/link";

export default function SetupTitle({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <div className="mb-12.5 flex w-full items-center justify-between pt-7.5">
      <Link href={`/${locale}`}>
        <button className="w-14.5">
          <Image
            src="/Icons/Arrow.svg"
            alt="Arrow Icon"
            width={17}
            height={15}
          />
        </button>
      </Link>
      <h1 className="text-grey-100 text-2xl font-bold">
        {t("Quick Setup", messages)}
      </h1>

      <LocaleSwitcher locale={locale} />
    </div>
  );
}
