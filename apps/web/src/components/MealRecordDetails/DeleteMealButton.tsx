"use client";

import { useState } from "react";
import deleteMealRecord from "@/services/api/deleteMealRecord";

export default function DeleteMealButton({ mealId }: { mealId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteMealRecord(mealId);
      // TODO: Redirect or show success message
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete meal";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        className="bg-red-80 rounded-b-md p-4 text-white disabled:opacity-50"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : `Delete meal ID ${mealId}`}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
