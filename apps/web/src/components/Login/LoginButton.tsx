"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import createClient from "@/lib/supabase/client";
import { t, Messages } from "@/lib/internationalisation/i18n-helpers";
import { Locale } from "@calculories/shared-types";
import { Button } from "@/components/Shared/Button";

export default function LoginButton({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setError("There was an error logging in with Google. Please try again.");
      console.error("Error logging in with Google:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-25 mx-auto flex w-[320px] flex-col gap-3">
      <Button onClick={loginWithGoogle} disabled={isGoogleLoading}>
        <p className="text-nowrap">
          {isGoogleLoading
            ? t("Loading...", messages)
            : t("Continue with Google", messages)}
        </p>
      </Button>

      {error && (
        <p className="text-grey-40 text-center text-sm font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
