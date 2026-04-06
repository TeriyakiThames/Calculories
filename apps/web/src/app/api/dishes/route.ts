import createClient from "@/lib/supabase/server";
import {
  RawDishType,
  RawRestaurantType,
  RawDishData,
} from "@calculories/shared-types";
import { z } from "zod";

const GetDishesByIdsSchema = z.object({
  ids: z.array(z.number().int()),
});

function getGetDishesByIdsSchema() {
  return GetDishesByIdsSchema;
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

    const body_data = await request.json();
    const parseData = getGetDishesByIdsSchema().safeParse(body_data);

    if (!parseData.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: parseData.error,
        }),
        { status: 400 },
      );
    }

    const { ids: id_list } = parseData.data;

    const { data, error } = await supabase
      .from("dish_sum_view")
      .select(
        `
        *,
        dish_type_map(
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
        )
        `,
      )
      .in("id", id_list);

    if (error) {
      console.error("Error fetching dish from database:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch dishes by ids" }),
        {
          status: 500,
        },
      );
    }

    const formattedData = data.map((data: RawDishData) => ({
      ...data,
      dish_types: data.dish_type_map.map((t: RawDishType) => t.dish_type),
      restaurant: {
        ...data.restaurant,
        restaurant_types: data.restaurant.restaurant_type_map.map(
          (t: RawRestaurantType) => t.restaurant_type,
        ),
        restaurant_type_map: undefined,
      },
      dish_component_map: undefined,
      dish_type_map: undefined,
    }));

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
