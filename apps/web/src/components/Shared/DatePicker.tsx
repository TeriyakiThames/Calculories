"use client";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
}

export default function DatePicker({
  selectedDate,
  setSelectedDate,
}: DatePickerProps) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      animate
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      required={true}
      classNames={{
        today: `text-green-100`,
        selected: `transition-full duration-200 rounded-full bg-green-100 font-bold text-white`, // Highlight the selected day
        root: `${defaultClassNames.root} text-grey-100`,
        chevron: `fill-grey-40`,
      }}
    />
  );
}
