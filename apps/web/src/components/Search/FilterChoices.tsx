import { Locale, TypeItem } from "@calculories/shared-types";

interface FilterChoicesProps {
  options: TypeItem[];
  value?: number[];
  onChange: (value: number[]) => void;
  locale: Locale;
}

export default function FilterChoices({
  options,
  value = [],
  onChange,
  locale,
}: FilterChoicesProps) {
  const toggleOption = (id: number) => {
    if (!onChange) return;

    if (value.includes(id)) {
      const updatedArray = value.filter((item) => item !== id);
      onChange(updatedArray);
    } else {
      const updatedArray = [...value, id];
      onChange(updatedArray);
    }
  };

  return (
    <>
      {options.map((option) => {
        const isActive = value.includes(option.id);

        return (
          <button
            type="button"
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`rounded-[40px] border px-4 py-3 text-center text-xs leading-none text-nowrap transition-colors ${
              isActive
                ? "bg-green-10 border-green-100 text-green-100"
                : "bg-background-1 text-grey-60 border-grey-60"
            }`}
          >
            {locale == "en" ? option.type_en : option.type_th}
          </button>
        );
      })}
    </>
  );
}
