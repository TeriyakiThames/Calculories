import createClient from "@/lib/supabase/server";
import { z } from "zod";
import { Component } from "@calculories/shared-types";

const AddMealHistorySchema = z.object({
  dish_id: z.number(),
  edited_carbs: z.number().optional(),
  edited_protein: z.number().optional(),
  edited_fat: z.number().optional(),
  edited_alcohol: z.number().optional(),
});

function getAddMealHistorySchema() {
  return AddMealHistorySchema;
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
    const mealHistory = await request.json();
    const parsedMealHistory = getAddMealHistorySchema().safeParse(mealHistory);

    if (!parsedMealHistory.success) {
      return new Response(
        JSON.stringify({ error: "Invalid meal history data" }),
        {
          status: 400,
        },
      );
    }

    const { ...data } = parsedMealHistory.data;

    console.log({ ...data });
    const { error } = await supabase
      .from("meal_history")
      .insert({ ...data, user_id: user!.id });

    console.log({ error });
    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to insert meal history" }),
        {
          status: 500,
        },
      );
    }
    return new Response(
      JSON.stringify({ message: "Meal history added successfully" }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}

export async function GET() {
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

    const { data, error } = await supabase
      .from("meal_history")
      .select(
        `
        *,
        dish ( 
        name_th, name_en, res_id, price,
         dish_component_map ( 
          component ( calorie, protein, fat, carbs )
        )
      )
      `,
      )
      .eq("user_id", user!.id);

    const formattedData = data?.map((meal) => ({
      ...meal,
      ...meal.dish,
      component: meal.dish?.dish_component_map?.map(
        (d: { component: Component }) => d.component,
      ),
      dish: undefined,
      dish_component_map: undefined,
    }));

    if (error) {
      console.log("Error fetching meal history from database:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch meal history" }),
        {
          status: 500,
        },
      );
    }

    return new Response(JSON.stringify({ data: formattedData }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
