import createClient from "@/lib/supabase/server";
import { fetchDishFromDb } from "@/services/api/fetchDishFromDb";
import { Dish } from "@calculories/shared-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mid: string }> },
) {
  const mealId = parseInt((await params).mid);

  if (Number.isNaN(mealId)) {
    return new Response(JSON.stringify({ error: "Invalid meal record ID" }), {
      status: 400,
    });
  }

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
      .select()
      .eq("id", mealId)
      .single();

    if (error) {
      console.error(
        `Error fetching meal record ID ${mealId} from database:`,
        error,
      );
      return new Response(
        JSON.stringify({ error: "Failed to fetch meal record" }),
        {
          status: 500,
        },
      );
    }

    const response = await fetchDishFromDb(data.dish_id);

    if (!response.ok) {
      return response;
    }

    const dish = (await response.json()) as Dish;

    return new Response(JSON.stringify({ ...data, dish: dish }), {
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
