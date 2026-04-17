export default async function getRestaurantById(id: number) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/restaurants/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant by ID");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    throw error;
  }
}
