import { Locale } from "@calculories/shared-types";
import { LOGIN_PATH } from "@/constants/common";
import Link from "next/link";

export default async function AuthErrorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = await params;

  return (
    <div>
      <div>Error occured while signing in. Please try logging in again.</div>

      <Link href={`/${locale}`}>Go Back to Home Page</Link>
      <br />

      <Link href={LOGIN_PATH(locale)}>Login</Link>
    </div>
  );
}
