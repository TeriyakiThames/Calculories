import createClient from "@/lib/supabase/server";

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
    const { data, error } = await supabase.from("restaurant_type").select(
      `
        *
        `,
    );

    if (error) {
      console.error("Error fetching user from database:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
