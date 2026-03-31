"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import createClient from "@/lib/supabase/client";
import { LOGIN_PATH } from "@/constants/common";
import useUser from "@/hooks/useUser";
import { Messages, t } from "@/lib/internationalisation/i18n-helpers";
import { Button } from "@/components/Shared/Button";
import Image from "next/image";

export default function AuthButton({ messages }: { messages: Messages }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const locale = pathname.split("/")[1];

  if (loading || pathname === LOGIN_PATH(locale)) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(LOGIN_PATH(locale));
    router.refresh();
  };

  const isLogin = !user;
  const borderColor = isLogin ? "border-green-80" : "border-red-80";
  const activeShadow = isLogin ? "#6cbcad" : "#ed7d7d";

  const buttonElement = (
    <Button
      onClick={user ? handleLogout : undefined}
      className={`text-grey-100! flex items-center border bg-white! px-5! active:bg-white! ${borderColor} active:shadow-[0_0_2px_0_${activeShadow}]`}
    >
      <span className="flex items-center gap-3">
        {isLogin ? (
          <div
            className="bg-green-80 h-6 w-6 rotate-180"
            style={{
              mask: 'url("/Icons/Logout.svg") no-repeat center / contain',
              WebkitMask: 'url("/Icons/Logout.svg") no-repeat center / contain',
            }}
          />
        ) : (
          <Image
            src="/Icons/Logout.svg"
            alt="Logout Icon"
            width={24}
            height={24}
          />
        )}
        <span>{t(isLogin ? "login" : "logout", messages)}</span>
      </span>
    </Button>
  );

  return isLogin ? (
    <Link href={LOGIN_PATH(locale)} className="block w-full">
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  );
}
