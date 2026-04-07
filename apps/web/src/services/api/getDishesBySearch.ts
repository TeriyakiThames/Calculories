import { GetDishesBySearchRequest } from "@calculories/shared-types";

export default async function getDishesBySearch(
  data: GetDishesBySearchRequest,
) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/dishes/search`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get dishes by search");
    }

    const returnData = await response.json();
    return returnData;
  } catch (error) {
    console.error("Error getting dishes by search:", error);
    throw error;
  }
}
