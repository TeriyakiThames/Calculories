import Image from "next/image";
import { t, Messages } from "@/lib/internationalisation/i18n-helpers";

interface TopBarProps {
  name: string;
  imageURL?: string;
  messages: Messages;
}

export default function TopBar({
  name,
  imageURL = "/Home/MockProfilePicture.svg",
  messages,
}: TopBarProps) {
  return (
    <div className="flex items-center justify-between p-7.5">
      <span className="flex items-center gap-3">
        <Image
          src={imageURL}
          alt="Profile picture"
          width={48}
          height={48}
          className="rounded-[48px]"
        />

        <span>
          <h1 className="flex items-center text-xl font-bold whitespace-pre text-[#1A1A1A]">
            {t("greeting", messages)},{" "}
            <span className="max-w-[15ch] truncate">{name}</span>
          </h1>
          <p className="text-xs font-bold text-[#8E8E93]">
            {t("subtitle", messages)}
          </p>
        </span>
      </span>
    </div>
  );
}
