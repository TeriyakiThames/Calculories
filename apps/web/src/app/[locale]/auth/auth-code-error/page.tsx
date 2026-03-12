import { LOGIN_PATH } from "@/constants/common";
import Link from "next/link";

export default function AuthErrorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <div>
      <div>Error occured while signing in. Please try logging in again.</div>

      <Link href={`/${locale}`}>Go Back to Home Page</Link>
      <br />

      <Link href={LOGIN_PATH(locale)}>Login</Link>
    </div>
  );
}
