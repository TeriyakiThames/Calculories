import Image from "next/image";
import { t, Messages } from "@/lib/i18n";

interface TopBarProps {
  name: string;
  messages: Messages;
}

export default function TopBar({ name, messages }: TopBarProps) {
  return (
    <div className="flex items-center justify-between p-7.5">
      <span className="flex items-center gap-3">
        <Image
          src="/Home/MockProfilePicture.svg"
          alt={t("profile_alt", messages)}
          width={48}
          height={48}
        />

        <span>
          <h1 className="text-xl font-bold text-[#1A1A1A]">
            {t("greeting", messages)}, {name}
          </h1>
          <p className="text-xs font-bold text-[#8E8E93]">
            {t("subtitle", messages)}
          </p>
        </span>
      </span>

      <Image
        src="/Icons/NotificationIcon.svg"
        alt={t("notification_alt", messages)}
        width={24}
        height={27}
      />
    </div>
  );
}
