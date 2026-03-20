export default async function updateUser(data: any) {
    try {
        const baseUrl =
            typeof window === "undefined"
                ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
                : "";

        const response = await fetch(
            `${baseUrl}/api/user`,
            {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    }
    catch (error) {
        console.error("Error updating user:", error);
    }
}