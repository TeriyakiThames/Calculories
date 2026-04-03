import createClient from "@/lib/supabase/server";
import { z } from "zod";
import {
  RawDishType,
  RawRestaurantType,
  RawDishData,
} from "@calculories/shared-types";

const GetDishesByIdsSchema = z.object({
  search_string: z.string().optional(),
  sort_by: z
    .enum([
      "price",
      "total_calorie",
      "total_protein",
      "total_fat",
      "total_carbs",
    ])
    .optional(),
  ascending: z.boolean().optional(),
  dish_type_ids: z.array(z.number().int()).optional(),
  restaurant_type_ids: z.array(z.number().int()).optional(),
  has_dine_in: z.boolean().optional(),
  has_delivery: z.boolean().optional(),
  restaurant_is_halal: z.boolean().optional(),
  is_vegetarian: z.boolean().optional(),
  dish_is_halal: z.boolean().optional(),
  no_gluten: z.boolean().optional(),
  no_lactose: z.boolean().optional(),
  no_peanut: z.boolean().optional(),
  no_shellfish: z.boolean().optional(),
  from: z.number().int(),
  to: z.number().int(),
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

    const {
      search_string: search_string,
      sort_by: sort_by,
      ascending: ascending,
      dish_type_ids: dish_type_ids,
      restaurant_type_ids: restaurant_type_ids,
      has_dine_in: has_dine_in,
      has_delivery: has_delivery,
      restaurant_is_halal: restaurant_is_halal,
      is_vegetarian: is_vegetarian,
      dish_is_halal: dish_is_halal,
      no_gluten: no_gluten,
      no_lactose: no_lactose,
      no_peanut: no_peanut,
      no_shellfish: no_shellfish,
      from: from,
      to: to,
    } = parseData.data;

    let query = supabase
      .from("dish_sum_view")
      .select(
        `
        *,
        dish_type_map!inner(
         dish_type(*)
        ),
        restaurant!inner(
         *,
         restaurant_type_map!inner(
          restaurant_type(*)
         )
        )
        `,
      )
      .range(from, to);

    if (search_string && search_string.trim() != "") {
      query = query.or(
        `name_en.ilike.%${search_string}%,name_th.ilike.%${search_string}%`,
      ); // match th or en name
    }
    if (sort_by) {
      query = query.order(sort_by, { ascending: ascending }); // sort by, accending
    }
    if (dish_type_ids && dish_type_ids.length != 0) {
      query = query.in("dish_type_map.type_id", dish_type_ids); // dish types
    }
    if (restaurant_type_ids && restaurant_type_ids.length != 0) {
      query = query.in(
        "restaurant.restaurant_type_map.type_id",
        restaurant_type_ids,
      ); // restaurant types
    }
    if (has_dine_in) {
      query = query.eq("restaurant.has_dine_in", true);
    }
    if (has_delivery) {
      query = query.eq("restaurant.has_delivery", true);
    }
    if (restaurant_is_halal) {
      query = query.eq("restaurant.is_halal", true);
    }
    if (is_vegetarian) {
      query = query.eq("is_vegetarian", true);
    }
    if (dish_is_halal) {
      query = query.eq("is_halal", true);
    }
    if (no_gluten) {
      query = query.eq("has_gluten", false);
    }
    if (no_lactose) {
      query = query.eq("has_lactose", false);
    }
    if (no_peanut) {
      query = query.eq("has_peanut", false);
    }
    if (no_shellfish) {
      query = query.eq("has_shellfish", false);
    }
    const { data, error } = await query;

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
