"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import createClient from "@/lib/supabase/client";

import { LOGIN_PATH } from "@/constants/common";
import useUser from "@/hooks/useUser";

export default function AuthButton() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const locale = pathname.split("/")[1];

  if (pathname === LOGIN_PATH(locale)) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(LOGIN_PATH(locale));
    router.refresh();
  };

  if (loading) return null;

  if (user) {
    return (
      <button onClick={handleLogout} className="border border-amber-300">
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button className="border border-amber-300">
      <Link href={LOGIN_PATH(locale)}>
        <span>Login</span>
      </Link>
    </button>
  );
}
