import createClient from "@/lib/supabase/server";
import { z } from "zod";

const UpdateUserSchema = z.object({
  username: z.string().optional(),
  dob: z.string().optional(),
  sex: z.enum(["Female", "Male", "Other"]).optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  activity_level: z.number().optional(),
  goal: z.enum(["Balanced", "Moderate", "HighProtein", "Ketogenic"]).optional(),
  vegetarian_default: z.boolean().optional(),
  no_lactose_default: z.boolean().optional(),
  no_peanut_default: z.boolean().optional(),
  gluten_free_default: z.boolean().optional(),
  halal_default: z.boolean().optional(),
  no_shellfish_default: z.boolean().optional(),
  is_setup_finished: z.boolean().optional(),
});

function getUpdateUserSchema() {
  return UpdateUserSchema;
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
      .from("user")
      .select(
        `
        *,
        diet_profile ( * )
        `,
      )
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user from database:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ ...data }), { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function PATCH(request: Request) {
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
    const parseData = getUpdateUserSchema().safeParse(data);

    if (!parseData.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: parseData.error,
        }),
        { status: 400 },
      );
    }

    const userdata = parseData.data;

    const { error } = await supabase
      .from("user")
      .update(userdata)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user in database:", error);
      return new Response(JSON.stringify({ error: "Failed to update user" }), {
        status: 500,
      });
    }
    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
