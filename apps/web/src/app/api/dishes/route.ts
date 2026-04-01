import createClient from "@/lib/supabase/server";
import {
  RawDishType,
  RawRestaurantType,
  RawDishComponent,
} from "@calculories/shared-types";
import { z } from "zod";

interface RawData {
  id: number;
  name_th: string;
  name_en: string;
  res_id: number;
  price: number;
  dish_type_map: RawDishType[];
  restaurant: {
    id: number;
    lat: number;
    lon: number;
    url: string;
    name_en: string;
    name_th: string;
    is_halal: boolean;
    has_dine_in: boolean;
    has_delivery: boolean;
    restaurant_type_map: RawRestaurantType[];
  };
  dish_component_map: RawDishComponent[];
}

const SubsetComponentKeysTypes = [
  "total_fat",
  "total_carbs",
  "total_alcohol",
  "total_calorie",
  "total_protein",
] as const;
type SubsetComponentKeys = (typeof SubsetComponentKeysTypes)[number];

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
      .from("dish")
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

    const formattedData = data.map((data: RawData) => {
      const tempDish = {
        ...data,
        dish_types: data.dish_type_map.map((t: RawDishType) => t.dish_type),
        restaurant: {
          ...data.restaurant,
          restaurant_types: data.restaurant.restaurant_type_map.map(
            (t: RawRestaurantType) => t.restaurant_type,
          ),
          restaurant_type_map: undefined,
        },
        components: data.dish_component_map
          ?.map((d: RawDishComponent) => {
            return { ...d.component, ratio: d.ratio };
          })
          .reduce(
            (acc, item) => {
              // sum fields (value * ratio)
              acc.total_fat += item.fat * item.ratio;
              acc.total_carbs += item.carbs * item.ratio;
              acc.total_alcohol += item.alcohol * item.ratio;
              acc.total_calorie += item.calorie * item.ratio;
              acc.total_protein += item.protein * item.ratio;

              // AND OR fields
              acc.is_halal = acc.is_halal && item.is_halal;
              acc.has_gluten = acc.has_gluten || item.has_gluten;
              acc.has_peanut = acc.has_peanut || item.has_peanut;
              acc.has_lactose = acc.has_lactose || item.has_lactose;
              acc.has_shellfish = acc.has_shellfish || item.has_shellfish;
              acc.is_vegetarian = acc.is_vegetarian && item.is_vegetarian;

              return acc;
            },
            {
              total_fat: 0,
              total_carbs: 0,
              total_alcohol: 0,
              total_calorie: 0,
              total_protein: 0,
              is_halal: true,
              has_gluten: false,
              has_peanut: false,
              has_lactose: false,
              has_shellfish: false,
              is_vegetarian: true,
            },
          ),
        dish_component_map: undefined,
        dish_type_map: undefined,
      };

      SubsetComponentKeysTypes.forEach((key) => {
        const componentKey = key as SubsetComponentKeys;
        tempDish.components[componentKey] = parseFloat(
          tempDish.components[componentKey].toFixed(2),
        );
      });

      return tempDish;
    });

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
