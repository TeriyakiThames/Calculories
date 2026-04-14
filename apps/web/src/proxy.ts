import { type NextRequest } from "next/server";

import updateSession from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all paths except /api, /_next, and static files
    "/((?!api|_next|_next/static|_next/image|assets|Icons|favicon.ico|sw.js).*)",
  ],
};
