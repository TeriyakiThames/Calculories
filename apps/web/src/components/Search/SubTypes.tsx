import { TypeItem, Locale } from "@calculories/shared-types";
import FilterChoices from "./FilterChoices";

interface SubTypesProps {
  title?: string;
  idList: number[];
  allItems: TypeItem[];
  selectedIds: number[];
  onChange: (val: number[]) => void;
  locale: Locale;
  scroll?: boolean;
}

export default function SubTypes({
  title,
  idList,
  allItems,
  selectedIds,
  onChange,
  locale,
  scroll = false,
}: SubTypesProps) {
  return (
    <div className="flex flex-col gap-1">
      {title && (
        <p className="text-grey-60 text-xs leading-none font-bold">{title}</p>
      )}
      <div className={`flex gap-2.5 ${scroll ? "" : "flex-wrap"}`}>
        <FilterChoices
          options={idList
            .map((id) => allItems.find((type) => type.id == id))
            .filter((v) => v !== undefined)}
          value={selectedIds}
          onChange={(val) => onChange(val)}
          locale={locale}
        />
      </div>
    </div>
  );
}
