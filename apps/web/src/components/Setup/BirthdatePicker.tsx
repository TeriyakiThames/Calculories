"use client";

import { useState } from "react";
import Image from "next/image";
import { InputHeader } from "@/components/Shared/Input";
import Popup from "@/components/Shared/Popup";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface BirthdatePickerProps {
  header: string;
  placeholder: string;
  value: string;
  onChange: (input: Date) => void;
  error?: string;
}

export default function BirthdatePicker({
  header,
  placeholder,
  value,
  onChange,
  error = "",
}: BirthdatePickerProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value === "" ? new Date() : new Date(value),
  );

  return (
    <div>
      <InputHeader header={header} />
      <div
        className="relative w-full hover:cursor-pointer"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        {/* TODO: padding of box, text colour */}
        <div
          className={`group bg-background-1 flex items-center rounded-xl border-[1.5px] px-5 transition-colors ${
            error
              ? "bg-grey-20 border-red-100 focus-within:border-red-100"
              : "border-grey-20 focus-within:border-green-100"
          }`}
        >
          <p
            className={`w-full bg-transparent py-4 leading-4 outline-none ${value === "" ? "text-grey-40" : "text-grey-100"}`}
          >
            {value === "" ? placeholder : value}
          </p>

          <div
            className="hover:bg-grey-10 -my-3 -mr-3 rounded-full p-3 hover:cursor-pointer"
            onClick={() => {
              setShowPopup(true);
            }}
          >
            <Image
              src="/Icons/Calendar.svg"
              alt="Select date and time"
              width={20}
              height={20}
              className="text-green-100"
            />
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup onClickOutside={() => setShowPopup(false)}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              value={selectedDate}
              onChange={(newValue) => {
                if (newValue) setSelectedDate(newValue);
              }}
              onAccept={(value) => {
                setShowPopup(false);
                onChange(value);
              }}
              onClose={() => setShowPopup(false)}
              //  TODO: fix bug where year button appears blue on open year selector
              sx={{
                "& .MuiButton-text": {
                  color: "#4aae9b",
                },
                "& .MuiYearCalendar-button": {
                  fontFamily: "inherit",
                },
                "& .MuiPickersCalendarHeader-labelContainer": {
                  fontFamily: "inherit",
                },
                "& .MuiButtonBase-root": {
                  fontFamily: "inherit",
                },
                "& .MuiPickerDay-root": {
                  background: "transparent",
                },
                "& .MuiTypography-root": {
                  fontFamily: "inherit",
                },
                "& .Mui-selected": {
                  background: "#4aae9b",
                },
              }}
            />
          </LocalizationProvider>
        </Popup>
      )}
    </div>
  );
}
