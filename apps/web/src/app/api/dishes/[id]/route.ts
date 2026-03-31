import { fetchDishFromDb } from "@/services/api/fetchDishFromDb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = parseInt((await params).id);

  return await fetchDishFromDb(id);
}
