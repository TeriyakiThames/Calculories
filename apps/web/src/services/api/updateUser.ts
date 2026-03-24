import { UpdateUserDto } from "@calculories/shared-types";

export default async function updateUser(data: UpdateUserDto) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        : "";

    const response = await fetch(`${baseUrl}/api/user`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to update user");      
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
