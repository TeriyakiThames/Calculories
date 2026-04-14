"use client";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { th as thDayPicker } from "react-day-picker/locale";
import { Locale } from "@calculories/shared-types";

interface DatePickerProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  locale: Locale;
}

export default function DatePicker({
  selectedDate,
  setSelectedDate,
  locale,
}: DatePickerProps) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      animate
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      required={true}
      locale={locale === "en" ? undefined : thDayPicker}
      classNames={{
        today: `text-green-100`,
        selected: `transition-full duration-200 rounded-full bg-green-100 font-bold text-white`, // Highlight the selected day
        root: `${defaultClassNames.root} text-grey-100`,
        chevron: `fill-grey-40`,
      }}
      startMonth={new Date(1900, 0)}
      endMonth={new Date(2027, 0)}
    />
  );
}
