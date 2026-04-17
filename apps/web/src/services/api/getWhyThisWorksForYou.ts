import {
  GetWhyThisWorksForYouRequest,
  GetWhyThisWorksForYouResponse,
} from "@calculories/shared-types";

export default async function getWhyThisWorksForYou(
  data: GetWhyThisWorksForYouRequest,
) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/explain-meal`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get Why This Works For You for dish ID ${data.dish.id}`,
      );
    }

    const responseData =
      (await response.json()) as GetWhyThisWorksForYouResponse;
    return responseData;
  } catch (error) {
    console.error("Error adding meal history:", error);
    throw error;
  }
}
