"use client";

import Popup from "@/components/Shared/Popup";
import addMealHistory from "@/services/api/addMealHistory";
import { useState } from "react";

export default function MealCardButton({ dishId }: { dishId: number }) {
  const [popup, setPopup] = useState({
    show: false,
    type: "", // "success" | "error"
    message: "",
  });

  const onAddMeal = async () => {
    try {
      await addMealHistory({ dish_id: dishId });

      setPopup({
        show: true,
        type: "success",
        message:
          "Your daily intake values has been updated. You can check the record in Meal History.",
      });
    } catch {
      setPopup({
        show: true,
        type: "error",
        message: "Failed to add meal. Please try again.",
      });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, type: "", message: "" });
  };
  return (
    <div>
      <button
        title="Add meal"
        onClick={onAddMeal}
        className="bg-green-10 rounded-full p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus-icon lucide-plus text-green-100"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
      {popup.show && (
        <Popup onClickOutside={closePopup}>
          {popup.type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-check-icon lucide-circle-check text-green-100"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-x-icon lucide-circle-x text-red-100"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          )}
          <h2
            className={`leading-none font-bold ${
              popup.type === "success" ? "text-grey-80" : "text-red-100"
            }`}
          >
            {popup.type === "success" ? "Meal Added!" : "Error"}
          </h2>

          <p className="text-grey-80 mb-6 leading-tight">{popup.message}</p>

          <button
            onClick={closePopup}
            className={`w-full rounded-2xl py-3 font-bold ${
              popup.type === "success"
                ? "bg-green-100 text-white"
                : "border border-red-100 text-red-100"
            }`}
          >
            OK
          </button>
        </Popup>
      )}
    </div>
  );
}
