import { Suspense } from "react";
import { loadMessages } from "@/lib/internationalisation/i18n";
import LocaleSwitcher, { Locale } from "@/components/Shared/LocaleSwitcher";
import LoginButton from "@/components/Login/LoginButton";
import LoginHeader from "@/components/Login/LoginHeader";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const loginMessages = loadMessages(
    locale,
    ["LoginHeader", "LoginButton"],
    "Login",
  );
  const sharedMessages = loadMessages(
    locale,
    ["AuthButton", "DeleteAccountButton"],
    "Shared",
  );
  const allMessages = { ...sharedMessages, ...loginMessages };

  return (
    <div className="mx-auto max-w-md py-12">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LocaleSwitcher locale={locale} className="absolute top-5 right-5" />
        <LoginHeader messages={allMessages} />
        <LoginButton locale={locale} messages={allMessages} />
      </Suspense>
    </div>
  );
}
