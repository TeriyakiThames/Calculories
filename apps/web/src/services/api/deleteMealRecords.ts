import { DeleteMealRecordsByIdsRequest } from "@calculories/shared-types";

export default async function deleteMealRecords(
  data: DeleteMealRecordsByIdsRequest,
) {
  try {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
      : "";

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (isServer) {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      // Forward only Supabase auth cookies instead of all cookies
      const supabaseCookieHeader = cookieStore
        .getAll()
        .filter(
          ({ name }) => name.startsWith("sb-") || name.startsWith("__Host-sb-"),
        )
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

      if (supabaseCookieHeader) {
        headers.Cookie = supabaseCookieHeader;
      }
    }

    const response = await fetch(`${baseUrl}/api/user/meal-history`, {
      method: "DELETE",
      body: JSON.stringify(data),
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to delete meal records by IDs");
    }

    const returnData = await response.json();
    return returnData;
  } catch (error) {
    console.error("Error deleting meal records by IDs:", error);
    throw error;
  }
}
