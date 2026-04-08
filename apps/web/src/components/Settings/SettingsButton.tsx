import Link from "next/link";
import { Button } from "../Shared/Button";
import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";
import { Locale, Messages } from "@calculories/shared-types";

interface SettingsButtonProps {
  label: string;
  messages: Messages;
  link: string;
  locale: Locale;
}

export function SettingsButton({
  label,
  messages,
  link,
  locale,
}: SettingsButtonProps) {
  return (
    <Link href={`/${locale}${link}`} className="block w-full">
      <Button className="text-grey-100! hover:bg-grey-10! bg-white! px-5! shadow-[0_0_2px_0_#00000040] active:bg-white! active:shadow-[0_0_2px_0_#4aae9b]">
        <div className="flex w-full items-center justify-between">
          <span>{t(label, messages)}</span>
          <Image
            src="/Icons/Dropdown.svg"
            alt="Dropdown Icon"
            width={24}
            height={24}
            className="rotate-270"
          />
        </div>
      </Button>
    </Link>
  );
}
