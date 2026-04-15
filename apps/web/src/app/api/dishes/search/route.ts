import createClient from "@/lib/supabase/server";
import { z } from "zod";
import {
  RawDishType,
  RawRestaurantType,
  RawDishData,
} from "@calculories/shared-types";
import { DISH_TYPES } from "@/constants/DishTypes";
import { RESTAURANT_TYPES } from "@/constants/RestaurantTypes";

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
  user: z
    .object({
      goal: z.enum(["Balanced", "Moderate", "HighProtein", "Ketogenic"]),
      target_calorie: z.number(),
      target_protein: z.number(),
      target_fat: z.number(),
      target_carbs: z.number(),
      vegetarian_default: z.boolean(),
      no_shellfish_default: z.boolean(),
      no_lactose_default: z.boolean(),
      no_peanut_default: z.boolean(),
      gluten_free_default: z.boolean(),
      halal_default: z.boolean(),
      diet_profile: z.object({
        calorie_intake: z.number(),
        protein_intake: z.number(),
        fat_intake: z.number(),
        carbs_intake: z.number(),
      }),
    })
    .optional(),
  location: z
    .object({
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable(),
    })
    .optional(),
  language: z.enum(["th", "en"]).optional(),
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
      user: userInfo,
      location: location,
      language: language,
    } = parseData.data;

    if (userInfo) {
      // Switch to ai
      /*const aiRequestbody = {
        user: {
          goal: userInfo.goal,
          target_calorie: userInfo.target_calorie,
          target_protein: userInfo.target_protein,
          target_fat: userInfo.target_fat,
          target_carbs: userInfo.target_carbs,
          dietary_restrictions: {
            vegetarian: userInfo.vegetarian_default,
            no_shellfish: userInfo.no_shellfish_default,
            no_lactose: userInfo.no_lactose_default,
            no_peanut: userInfo.no_peanut_default,
            gluten_free: userInfo.gluten_free_default,
            halal: userInfo.halal_default,
          },
          diet_profile: {
            calorie_intake: userInfo.diet_profile.calorie_intake,
            protein_intake: userInfo.diet_profile.protein_intake,
            fat_intake: userInfo.diet_profile.fat_intake,
            carbs_intake: userInfo.diet_profile.carbs_intake,
          },
          location: location,
          language: language,
        },
        screen: "search",
        search_query: search_string,
        top_n: 60,
        filters: {
          dish_type: dish_type_ids?.map(
            (id) => DISH_TYPES.filter((type) => type.id == id)[0].type_en,
          ),
          restaurant_type: restaurant_type_ids?.map(
            (id) => RESTAURANT_TYPES.filter((type) => type.id == id)[0].type_en,
          ),
          has_dine_in: has_dine_in,
          has_delivery: has_delivery,
          is_halal: restaurant_is_halal,
          dietary: {
            vegetarian: is_vegetarian,
            no_shellfish: no_shellfish,
            no_lactose: no_lactose,
            no_peanut: no_peanut,
            gluten_free: no_gluten,
            halal: dish_is_halal,
          },
        },
      };

      const aiResult = await fetch(
        `${process.env.AI_RECOMMENDER_URL}/recommend/search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aiRequestbody),
        },
      );
      const aiResultData = await aiResult.json();
      console.log(aiRequestbody);
      console.log(aiResultData);
      */
      const aiResultIds = [
        1, 12, 13, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20,
      ];

      let query = supabase
        .from("dish_sum_mat_view")
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
        .in("id", aiResultIds)
        .range(from, to);

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

      const formattedData2 = aiResultIds
        .slice(from, to + 1)
        .map((id) => formattedData.filter((record) => record.id == id)[0]);

      return new Response(JSON.stringify(formattedData2), {
        status: 200,
      });
    } else {
      // No ai
      let query = supabase
        .from("dish_sum_mat_view")
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
        query = query.order(sort_by, { ascending: ascending }).order("id"); // sort by, accending (secondary sort by id to ensure the same order when values are equal)
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
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
