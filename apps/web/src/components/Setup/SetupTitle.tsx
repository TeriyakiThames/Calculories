import { Locale } from "@calculories/shared-types";
import LocaleSwitcher from "@/components/Shared/LocaleSwitcher";
import Image from "next/image";

export default function SetupTitle({ locale }: { locale: Locale }) {
  return (
    <div className="mb-12.5 flex w-full items-center justify-between pt-7.5">
      {/* TODO: Add functionality after deciding where it should go back to */}
      <button className="w-14.5">
        <Image src="/Icons/Arrow.svg" alt="Arrow Icon" width={17} height={15} />
      </button>

      <h1 className="text-grey-100 text-2xl font-bold">Quick Setup</h1>

      {/* TODO: Add translations for Setup page */}
      <LocaleSwitcher locale={locale} />
    </div>
  );
}
