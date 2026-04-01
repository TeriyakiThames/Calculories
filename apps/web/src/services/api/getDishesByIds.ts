import { GetDishesByIdsRequest } from "@calculories/shared-types";

export default async function getDishesByIds(data: GetDishesByIdsRequest) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/dishes`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get dishes by ids");
    }

    const returnData = await response.json();
    return returnData;
  } catch (error) {
    console.error("Error getting dishes by ids:", error);
    throw error;
  }
}
