"use server";

import createClient from "@/lib/supabase/server";
import {
  RawDishType,
  RawRestaurantType,
  RawDishComponent,
} from "@calculories/shared-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = parseInt((await params).id);
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
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching dish from database:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch dish" }), {
        status: 500,
      });
    }

    const formattedData = {
      ...data,
      dish_types: data.dish_type_map.map((t: RawDishType) => t.dish_type),
      restaurant: {
        ...data.restaurant,
        restaurant_types: data.restaurant.restaurant_type_map.map(
          (t: RawRestaurantType) => t.restaurant_type,
        ),
        restaurant_type_map: undefined,
      },
      components: data.dish_component_map?.map((d: RawDishComponent) => {
        return { ...d.component, ratio: d.ratio };
      }),
      dish_component_map: undefined,
      dish_type_map: undefined,
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
