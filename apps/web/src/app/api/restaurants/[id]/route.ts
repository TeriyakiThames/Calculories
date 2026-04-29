import createClient from "@/lib/supabase/server";
import {
  RawRestaurantType,
  RawDishType,
  RawDishSumViewData,
} from "@calculories/shared-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const idString = (await params).id;
  const id = Number(idString);

  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid restaurant ID" }), {
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
      .from("restaurant")
      .select(
        `
          *,
          restaurant_type_map(restaurant_type(*)),
          dish_sum_mat_view(*, dish_type_map(dish_type(*)))
            `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching restaurant ID ${id} from database:`, error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch restaurant" }),
        {
          status: 500,
        },
      );
    }

    const formattedData = {
      ...data,
      restaurant_types: data?.restaurant_type_map?.map(
        (t: RawRestaurantType) => t.restaurant_type,
      ),
      dishes: data?.dish_sum_mat_view.map((dish: RawDishSumViewData) => ({
        ...dish,
        dish_types: dish.dish_type_map.map(
          (type: RawDishType) => type.dish_type,
        ),
        dish_type_map: undefined,
      })),
      dish_sum_mat_view: undefined,
      restaurant_type_map: undefined,
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
