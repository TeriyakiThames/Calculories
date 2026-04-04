import { UpdateMealHistoryRequest } from "@calculories/shared-types";

export default async function updateMealRecord(
  data: UpdateMealHistoryRequest,
  id: number,
) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/user/meal-history/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update meal record");
    }
  } catch (error) {
    console.error("Error updating meal record:", error);
    throw error;
  }
}
