export default async function getUser() {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";
    const response = await fetch(`${baseUrl}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
