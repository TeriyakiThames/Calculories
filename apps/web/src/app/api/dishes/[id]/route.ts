import createClient from "@/lib/supabase/server";

interface RawDishType {
  dish_type: {
    id: number;
    type_en: string;
    type_th: string;
  };
}

interface RawRestaurantType {
  restaurant_type: {
    id: number;
    type_en: string;
    type_th: string;
  };
}

interface RawDishComponent {
  ratio: number;
  dish_id: number;
  component: {
    id: number;
    fat: number;
    carbs: number;
    alcohol: number;
    calorie: number;
    name_en: string;
    name_th: string;
    protein: number;
    is_halal: boolean;
    has_gluten: boolean;
    has_peanut: boolean;
    has_lactose: boolean;
    has_shellfish: boolean;
    is_vegetarian: boolean;
  };
  component_id: number;
}

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
