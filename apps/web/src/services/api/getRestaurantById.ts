export default async function getRestaurantById(id: number) {
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

    const response = await fetch(`${baseUrl}/api/restaurants/${id}`, {
      method: "GET",
      credentials: "include",
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch restaurant");
    }

    return data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error;
  }
}
