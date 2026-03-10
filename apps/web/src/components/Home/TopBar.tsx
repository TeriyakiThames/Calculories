import Image from "next/image";

interface TopBarProps {
  name: string;
}

export default function TopBar({ name }: TopBarProps) {
  return (
    <div className="flex items-center justify-between p-7.5">
      <span className="flex items-center gap-3">
        <Image
          src="/Home/MockProfilePicture.svg"
          alt="Profile Icon"
          width={48}
          height={48}
        />

        <span>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Hi, {name}</h1>
          <p className="text-xs font-bold text-[#8E8E93]">
            Let&apos;s make good choices today!
          </p>
        </span>
      </span>

      {/* TODO: Add functionality to notification icon too! */}
      <Image
        src="/Icons/NotificationIcon.svg"
        alt="Profile Icon"
        width={24}
        height={27}
      />
    </div>
  );
}
