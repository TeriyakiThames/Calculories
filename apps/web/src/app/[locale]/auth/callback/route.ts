import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin, pathname } = new URL(request.url);
  const locale = pathname.split("/")[1];
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? `/${locale}/setup`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
}
