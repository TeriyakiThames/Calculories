import createClient from "@/lib/supabase/server";
import {
  RawDishType,
  RawRestaurantType,
  RawDishComponent,
} from "@calculories/shared-types";
import { z } from "zod";

const updateMealHistorySchema = z.object({
  at: z.string().optional(),
  edited_carbs: z.number().optional(),
  edited_protein: z.number().optional(),
  edited_fat: z.number().optional(),
  edited_alcohol: z.number().optional(),
});

function getupdateMealHistorySchema() {
  return updateMealHistorySchema;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mid: string }> },
) {
  const id = parseInt((await params).mid);
  if (Number.isNaN(id)) {
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
      .select(
        `
        *,
        dish_sum_mat_view(*, dish_type_map(
         dish_type(*)
        ),
        restaurant (
         *,
         restaurant_type_map(
          restaurant_type(*)
         )
        ),
        dish_component_map(
         *,
         component(*)
        ))
        `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        `Error fetching meal record ID ${id} from database:`,
        error,
      );
      return new Response(
        JSON.stringify({ error: "Failed to fetch meal record" }),
        {
          status: 500,
        },
      );
    }

    const { dish_sum_mat_view, ...mealRecordData } = data;
    const {
      restaurant: { restaurant_type_map, ...restaurant },
      dish_type_map,
      dish_component_map,
      ...dishData
    } = dish_sum_mat_view;

    const formattedData = {
      ...mealRecordData,
      ...dishData,
      dish_types: dish_type_map.map((t: RawDishType) => t.dish_type),
      restaurant: {
        ...restaurant,
        restaurant_types: restaurant_type_map.map(
          (t: RawRestaurantType) => t.restaurant_type,
        ),
      },

      components: dish_component_map?.map((d: RawDishComponent) => {
        return { ...d.component, ratio: d.ratio };
      }),
    };

    return new Response(JSON.stringify(formattedData), {
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ mid: string }> },
) {
  const id = parseInt((await params).mid);
  if (Number.isNaN(id)) {
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

    const { error } = await supabase
      .from("meal_history")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Meal record ID ${id} not found:`, error);
      return new Response(JSON.stringify({ error: "Meal record not found" }), {
        status: 500,
      });
    }

    const response = await supabase.from("meal_history").delete().eq("id", id);

    if (response.error) {
      console.error(
        `Error deleting meal record ID ${id}from database:`,
        response.error,
      );
      return new Response(
        JSON.stringify({ error: "Failed to delete meal record" }),
        {
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({ status: 204, statusText: "No Content", ok: true }),
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ mid: string }> },
) {
  const id = parseInt((await params).mid);
  if (Number.isNaN(id)) {
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

    const data = await request.json();
    const parseData = getupdateMealHistorySchema().safeParse(data);

    if (!parseData.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: parseData.error,
        }),
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("meal_history")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Meal record ID ${id} not found:`, error);
      return new Response(JSON.stringify({ error: "Meal record not found" }), {
        status: 500,
      });
    }

    const updateData = parseData.data;

    const response = await supabase
      .from("meal_history")
      .update(updateData)
      .eq("id", id);

    if (response.error) {
      console.error(
        `Error updating meal record ID ${id} in database:`,
        response.error,
      );
      return new Response(
        JSON.stringify({ error: "Failed to update meal record" }),
        {
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({ status: 200, statusText: "OK", ok: true }),
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
