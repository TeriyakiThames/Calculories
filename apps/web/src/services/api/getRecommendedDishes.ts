import {
  GetRecommendedDishesRequest,
  GetRecommendedDishesResponse,
} from "@calculories/shared-types";

export default async function getRecommendedDishes(
  data: GetRecommendedDishesRequest,
) {
  try {
    const response = await fetch(
      "https://calculories-ai-recommender.onrender.com/recommend/home",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recommended dishes from AI");
    }

    const responseData =
      (await response.json()) as GetRecommendedDishesResponse;
    return responseData;
  } catch (error) {
    console.error("Error fetching recommended dishes:", error);
    throw error;
  }
}
