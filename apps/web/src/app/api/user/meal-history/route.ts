import createClient from "@/lib/supabase/server";
import { z } from "zod";
import { Component, ComponentNutrition } from "@calculories/shared-types";

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

const DeleteMealRecordsByIdsSchema = z.object({
  ids: z.array(z.number().int()),
});

function getDeleteMealRecordsByIdsSchema() {
  return DeleteMealRecordsByIdsSchema;
}

function calculateTotalDishComponent(
  components: {
    ratio: number;
    component: ComponentNutrition;
  }[],
) {
  const totals = components.reduce(
    (total, { ratio, component }) => ({
      total_calorie:
        Math.round((total.total_calorie + component.calorie * ratio) * 100) /
        100,
      total_protein:
        Math.round((total.total_protein + component.protein * ratio) * 100) /
        100,
      total_fat:
        Math.round((total.total_fat + component.fat * ratio) * 100) / 100,
      total_carbs:
        Math.round((total.total_carbs + component.carbs * ratio) * 100) / 100,
    }),
    { total_calorie: 0, total_protein: 0, total_fat: 0, total_carbs: 0 },
  );

  return totals;
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
      components: calculateTotalDishComponent(
        meal.dish?.dish_component_map.map(
          (d: { ratio: number; component: ComponentNutrition }) => ({
            ratio: d.ratio,
            component: d.component,
          }),
        ) || [],
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

export async function DELETE(request: Request) {
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

    const body = await request.json();
    const parseData = getDeleteMealRecordsByIdsSchema().safeParse(body);

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
      .from("meal_history")
      .select()
      .in("id", id_list);

    if (error) {
      console.error("Error fetching meal records:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch meal records by IDs" }),
        {
          status: 500,
        },
      );
    }

    // If not all record is found
    if (data.length != id_list.length) {
      console.error("Error fetching one or more meal records by IDs:", id_list);
      return new Response(
        JSON.stringify({ error: "Failed to fetch meal records by IDs" }),
        {
          status: 500,
        },
      );
    }

    const response = await supabase
      .from("meal_history")
      .delete()
      .in("id", id_list);

    if (response.error) {
      console.error(
        `Error deleting meal records by IDs from database:`,
        response.error,
      );
      return new Response(
        JSON.stringify({ error: "Failed to delete meal records" }),
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
