import createClient from "@/lib/supabase/server";
import { getRecommendByRestaurantRequest } from "@calculories/shared-types";
import { NextResponse } from "next/server";
import z from "zod";

const GetRecommendedByRestaurantSchema = z.object({
  user: z.object({
    goal: z.enum(["Balanced", "Moderate", "HighProtein", "Ketogenic"]),
    target_calorie: z.number(),
    target_protein: z.number(),
    target_fat: z.number(),
    target_carbs: z.number(),
    dietary_restrictions: z.object({
      vegetarian: z.boolean(),
      no_shellfish: z.boolean(),
      no_lactose: z.boolean(),
      no_peanut: z.boolean(),
      gluten_free: z.boolean(),
      halal: z.boolean(),
    }),
    diet_profile: z.object({
      calorie_intake: z.number(),
      protein_intake: z.number(),
      fat_intake: z.number(),
      carbs_intake: z.number(),
    }),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    language: z.enum(["en", "th"]),
  }),
  screen: z.string(),
  restaurant_id: z.string(),
  top_n: z.number(),
});

function getGetRecommendedByRestaurantSchema() {
  return GetRecommendedByRestaurantSchema;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
      });
    }

    const body: getRecommendByRestaurantRequest = await request.json();
    if (Number.isNaN(body.restaurant_id)) {
      return new Response(JSON.stringify({ error: "Invalid restaurant ID" }), {
        status: 400,
      });
    }

    const parseData = getGetRecommendedByRestaurantSchema().safeParse(body);

    if (!parseData.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: parseData.error,
        }),
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://calculories-ai-recommender.onrender.com/recommend/restaurant",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseData.data),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Render API Error:", response.status, errorText);
      return NextResponse.json(
        {
          error:
            "Failed to fetch recommended restaurant dishes from AI Recommender",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
