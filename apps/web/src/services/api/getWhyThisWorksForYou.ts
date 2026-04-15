import {
  GetWhyThisWorksForYouRequest,
  getWhyThisWorksForYouResponse,
} from "@calculories/shared-types";

export default async function getWhyThisWorksForYou(
  data: GetWhyThisWorksForYouRequest,
) {
  try {
    const response = await fetch(
      "https://calculories-ai-recommender.onrender.com/explain/meal",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to get Why This Works For You for dish ID ${data.dish.id}`,
      );
    }

    const responseData =
      (await response.json()) as getWhyThisWorksForYouResponse;
    return responseData;
  } catch (error) {
    console.error("Error adding meal history:", error);
    throw error;
  }
}
