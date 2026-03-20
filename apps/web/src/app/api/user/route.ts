import createClient from "@/lib/supabase/server";

export async function GET(request: Request) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('user').select(`
    *,
    diet_profile ( * )
    `);

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }
    return new Response(JSON.stringify({ data }));
}

export async function PATCH(request: Request) {
    const supabase = await createClient();

    const data = await request.json();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const { error } = await supabase.from('user').update(data).eq('id', user!.id);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
}