"use client";

import { use, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import createClient from "@/lib/supabase/client";

function LoginForm({ locale }: { locale: "en" | "th" }) {
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
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground mt-2">
          Login to your account to continue
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border px-4 py-3">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          "loading..."
        ) : (
          <div className="flex h-4 border border-red-500">
            <span className="ml-2">Login with Google</span>
          </div>
        )}
      </button>
    </>
  );
}

export default function LoginPage({
  params,
}: {
  params: Promise<{ locale: "en" | "th" }>;
}) {
  const { locale } = use(params);

  return (
    <div className="mx-auto max-w-md py-12">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LoginForm locale={locale} />
      </Suspense>
    </div>
  );
}
