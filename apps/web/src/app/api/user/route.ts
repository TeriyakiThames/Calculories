import createClient from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('user').select(`
        *,
        diet_profile ( * )
        `).eq('id', user!.id).single();

        if (error) {
            console.error("Error fetching user from database:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch user" }), { status: 500 });
        }


        return new Response(JSON.stringify({ ...data }), { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const supabase = await createClient();

    const data = await request.json();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const { error } = await supabase.from('user').update(data).eq('id', user!.id);

        if (error) {
            console.error("Error updating user in database:", error);
            return new Response(JSON.stringify({ error: "Failed to update user" }), { status: 500 });
        }
        return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }

}