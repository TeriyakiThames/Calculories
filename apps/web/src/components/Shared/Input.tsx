import Image from "next/image";

interface InputProps {
  header?: string;
  subheader?: string;
  placeholder?: string;
  type: "text" | "dropdown";
  value?: string;
  onChange: (value: string) => void;

  frontImageURL?: string;
  backImageURL?: string;
  options?: string[];
  error?: string;
}

interface InputHeaderProps {
  header: string;
  subheader?: string;
}

export function InputHeader({ header, subheader }: InputHeaderProps) {
  return (
    <div>
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
  type,
  options = [],
  value,
  error = "",
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <InputHeader header={header} subheader={subheader} />

      <div
        className={`group bg-background-1 flex items-center rounded-xl border-[1.5px] px-5 transition-colors ${
          error
            ? "bg-grey-20 border-red-100 focus-within:border-red-100"
            : "border-grey-20 focus-within:border-green-100"
        }`}
      >
        {frontImageURL && (
          <Image
            src={frontImageURL}
            alt="Front icon"
            width={20}
            height={20}
            className="mr-3"
          />
        )}

        {type === "text" ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="placeholder:text-grey-40 w-full bg-transparent py-4 leading-4 outline-none"
          />
        ) : (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full cursor-pointer appearance-none bg-transparent py-4 leading-4 outline-none ${
              value === "" ? "text-grey-40" : "text-grey-100"
            }`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt, index) => (
              <option key={index} value={opt} className="text-grey-100">
                {opt}
              </option>
            ))}
          </select>
        )}

        {backImageURL && (
          <Image
            src={backImageURL}
            alt="Back icon"
            width={20}
            height={20}
            className="ml-3"
          />
        )}
      </div>
      <p className="text-xs leading-3.5 font-normal text-red-100">{error}</p>
    </div>
  );
}
