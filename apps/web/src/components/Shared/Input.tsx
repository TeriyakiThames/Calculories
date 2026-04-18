"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface InputHeaderProps {
  header: string;
  subheader?: string;
}

interface InputProps {
  header?: string;
  subheader?: string;
  placeholder?: string;
  type: "text" | "dropdown";
  value?: string;
  onChange: (value: string) => void;
  frontImageURL?: string;
  backImageURL?: string;
  onClickBackImage?: () => void;
  unit?: string;
  options?: Record<string, string>;
  error?: string;
  onDropDownNameChange?: (name: string) => void;
  dropDownName?: string;
}

export function InputHeader({ header, subheader }: InputHeaderProps) {
  return (
    <div className="mb-1">
      <p className="text-grey-100 font-bold">{header}</p>
      {subheader && (
        <p className="text-grey-60 text-xs font-normal">{subheader}</p>
      )}
    </div>
  );
}

export function Input({
  header = "",
  subheader,
  placeholder,
  frontImageURL,
  backImageURL,
  onClickBackImage = () => {},
  unit,
  type,
  options = {},
  value = "",
  error = "",
  onChange,
  onDropDownNameChange = () => {},
  dropDownName = "",
}: InputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2">
      {header && <InputHeader header={header} subheader={subheader} />}

      <div className="relative w-full" ref={dropdownRef}>
        <div
          onClick={() => type === "dropdown" && setIsOpen(!isOpen)}
          className={`group bg-background-1 flex items-center rounded-xl border-[1.5px] px-5 transition-colors ${
            type === "dropdown" ? "cursor-pointer" : ""
          } ${
            error
              ? "bg-grey-20 border-red-100 focus-within:border-red-100"
              : `border-grey-20 focus-within:border-green-100 ${isOpen ? "border-green-100" : ""}`
          }`}
        >
          {frontImageURL && (
            <Image
              src={frontImageURL}
              alt=""
              width={20}
              height={20}
              className="mr-3"
            />
          )}

          {type === "text" ? (
            <div className="flex w-full items-center">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="placeholder:text-grey-40 text-grey-100 w-full bg-transparent py-4 leading-4 outline-none"
              />
              {/* Unit label logic */}
              {unit && (
                <span className="text-grey-40 ml-2 text-sm whitespace-nowrap">
                  {unit}
                </span>
              )}
            </div>
          ) : (
            <div className="flex w-full items-center justify-between py-4 leading-4">
              <span
                className={
                  dropDownName === "" ? "text-grey-40" : "text-grey-100"
                }
              >
                {dropDownName === "" ? placeholder : dropDownName}
              </span>
              <Image
                src="/Icons/Dropdown.svg"
                alt=""
                width={20}
                height={20}
                className={`ml-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          )}

          {backImageURL && (
            <Image
              src={backImageURL}
              onClick={onClickBackImage}
              alt=""
              width={20}
              height={20}
              className="ml-3"
            />
          )}
        </div>

        {/* Dropdown Menu */}
        {type === "dropdown" && isOpen && (
          <div className="border-grey-20 bg-background-1 absolute top-full left-0 z-5 mt-2 w-full overflow-hidden rounded-xl border-[1.5px] shadow-md">
            {Object.entries(options).map(([value, name], index) => (
              <div
                key={`${value}-${index}`}
                onClick={() => {
                  onChange(value);
                  onDropDownNameChange(name);
                  setIsOpen(false);
                }}
                className="border-grey-20 text-grey-100 hover:bg-green-10 cursor-pointer border-b px-5 py-4 text-sm transition-colors last:border-b-0 hover:text-green-100"
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs font-normal text-red-100">{error}</p>}
    </div>
  );
}
