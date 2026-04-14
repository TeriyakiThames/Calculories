"use client";

import "react-day-picker/style.css";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { Locale, Messages } from "@calculories/shared-types";
import { t } from "@/lib/internationalisation/i18n-helpers";
import Popup from "@/components/Shared/Popup";
import DatePicker from "@/components/Shared/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button } from "@/components/Shared/Button";
import { th } from "date-fns/locale";
import { PickersInputComponentLocaleText } from "@mui/x-date-pickers/locales";

interface HadAtProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  messages: Messages;
  locale: Locale;
}

export default function HadAt({ date, setDate, messages, locale }: HadAtProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [showMainPopup, setShowMainPopup] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const setOnlyDate = (date: Date) => {
    setSelectedDate((prevDate) => {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        prevDate!.getHours(),
        prevDate!.getMinutes(),
      );
    });
  };
  const formatterDateTime = new Intl.DateTimeFormat("en-UK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formatterTime = new Intl.DateTimeFormat("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div>
      <div className="flex flex-col gap-5">
        <h2 className="text-grey-100 text-xl font-bold">
          {t("had_at", messages)}
        </h2>

        {/* Had at */}
        <div
          className="relative w-full hover:cursor-pointer"
          onClick={() => {
            setShowMainPopup(true);
            setSelectedDate(date);
          }}
        >
          <div
            className={`bg-background-1 border-grey-20 flex items-center rounded-xl border-[1.5px] px-5 transition-colors`}
          >
            <p className="text-grey-80 w-full bg-transparent py-4 leading-4 outline-none">
              {formatterDateTime.format(date)}
            </p>

            <div
              className="hover:bg-grey-10 -my-3 -mr-3 rounded-full p-3 hover:cursor-pointer"
              onClick={() => {
                setShowMainPopup(true);
                setSelectedDate(date);
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
      </div>

      {/* Main Popup: Date Picker */}
      {showMainPopup && (
        <Popup onClickOutside={() => setShowMainPopup(false)}>
          {/* Close button */}
          <button
            onClick={() => setShowMainPopup(false)}
            title="Close"
            className="hover:text-grey-100 hover:bg-grey-10 -m-3 self-end rounded-full p-3 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#858585" // text-grey-60
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x text-grey-100"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setOnlyDate}
            locale={locale}
          />

          <div
            className="relative w-full"
            onClick={() => {
              setShowMainPopup(false);
              setShowTimePopup(true);
            }}
          >
            <div
              className={`border-grey-20 flex items-center rounded-xl border-[1.5px] px-5 align-baseline transition-colors`}
            >
              <p className="text-grey-80 w-full items-start py-4 text-left leading-4 hover:cursor-pointer">
                {formatterTime.format(selectedDate)}
              </p>

              <div
                className="hover:bg-grey-10 -my-3 -mr-3 rounded-full p-3 hover:cursor-pointer"
                onClick={() => {
                  setShowMainPopup(false);
                  setShowTimePopup(true);
                }}
              >
                <Image
                  src="/Icons/Clock.svg"
                  alt="Select time"
                  width={24}
                  height={24}
                  className="text-green-100"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setDate(selectedDate);
              setShowMainPopup(false);
            }}
          >
            Apply
          </Button>
        </Popup>
      )}

      {/* Time Picker */}
      {showTimePopup && (
        <Popup
          onClickOutside={() => {
            setShowMainPopup(true);
            setShowTimePopup(false);
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
            <StaticTimePicker
              value={selectedDate}
              onChange={(newValue) => {
                if (newValue) setSelectedDate(newValue);
              }}
              onAccept={() => {
                setShowMainPopup(true);
                setShowTimePopup(false);
              }}
              onClose={() => {
                setShowMainPopup(true);
                setShowTimePopup(false);
              }}
              ampm={false}
              localeText={
                locale == "en"
                  ? {}
                  : ({
                      timePickerToolbarTitle: "เลือกเวลา",
                      cancelButtonLabel: "ยกเลิก",
                      okButtonLabel: "บันทึก",
                    } as PickersInputComponentLocaleText)
              }
              sx={{
                "& .MuiClock-pin": {
                  backgroundColor: "#4aae9b", // text-green-100
                },
                "& .MuiClockPointer-root": {
                  backgroundColor: "#4aae9b",
                },
                "& .MuiClockPointer-thumb": {
                  borderColor: "#4aae9b",
                  backgroundColor: "#4aae9b",
                },
                "& .MuiButtonBase-root": {
                  color: "#4aae9b",
                  fontFamily: "inherit",
                },
                "& .MuiClockNumber-root": {
                  fontFamily: "inherit",
                },
                "& .MuiTypography-root": {
                  fontFamily: "inherit",
                },
              }}
            />
          </LocalizationProvider>
        </Popup>
      )}
    </div>
  );
}
