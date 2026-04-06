import { CreateMealHistoryRequest } from "@calculories/shared-types";

export default async function addMealHistory(data: CreateMealHistoryRequest) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/user/meal-history`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to add meal history");
    }
  } catch (error) {
    console.error("Error adding meal history:", error);
    throw error;
  }
}
