import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { LOGIN_PATH } from "@/constants/common";

export default async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Initialize Supabase server client with custom cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Re-create the response with updated cookies
          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Fetch the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const locale = path.split("/")[1];
  const loginPath = LOGIN_PATH(locale);

  // Redirect unauthenticated users to login
  if (
    !user &&
    !path.startsWith(loginPath) &&
    !path.startsWith(`/${locale}/auth`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Prevent logged-in users from opening login page
  if (user && path.startsWith(loginPath)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
