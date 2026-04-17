import createClient from "@/lib/supabase/server";
import z from "zod";

const GetWhyThisWorksForYouSchema = z.object({
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
  dish: z.object({
    id: z.string(),
    name_en: z.string(),
    name_th: z.string(),
    restaurant_name_en: z.string(),
    restaurant_name_th: z.string(),
    restaurant_type: z.array(z.string()),
    price_thb: z.number(),
    nutrition: z.object({
      calories: z.number(),
      protein_g: z.number(),
      fat_g: z.number(),
      carbs_g: z.number(),
      fiber_g: z.number(),
    }),
  }),
});

function getGetWhyThisWorksForYouSchema() {
  return GetWhyThisWorksForYouSchema;
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

    const data = await request.json();
    const parseData = getGetWhyThisWorksForYouSchema().safeParse(data);

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
      // TODO: use env variable
      "https://calculories-ai-recommender.onrender.com/explain/meal",
      {
        method: "POST",
        body: JSON.stringify(parseData.data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responseData = await response.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
