"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import createClient from "@/lib/supabase/client";
import { t, Messages } from "@/lib/internationalisation/i18n-helpers";

export default function LoginButton({
  locale,
  messages,
}: {
  locale: "en" | "th";
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
      <button
        className="bg-primary-green-1 h-16 w-full rounded-2xl px-16 py-2 text-center text-lg font-bold text-white hover:bg-[#6cbcad]"
        onClick={loginWithGoogle}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading
          ? t("Loading...", messages)
          : t("Continue with Google", messages)}
      </button>

      {error && (
        <p className="text-center text-sm font-semibold text-[#adadad]">
          {error}
        </p>
      )}
    </div>
  );
}
