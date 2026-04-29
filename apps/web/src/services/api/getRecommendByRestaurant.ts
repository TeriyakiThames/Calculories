import {
  getRecommendByRestaurantRequest,
  getRecommendByRestaurantResponse,
} from "@calculories/shared-types";

export default async function getRecommendByRestaurant(
  data: getRecommendByRestaurantRequest,
) {
  try {
    const response = await fetch("/api/recommend/restaurant", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get dish recommendation by restaurant ID ${data.restaurant_id}`,
      );
    }

    const responseData =
      (await response.json()) as getRecommendByRestaurantResponse;
    return responseData;
  } catch (error) {
    console.error("Error adding meal history:", error);
    throw error;
  }
}
