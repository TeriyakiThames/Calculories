import { t } from "@/lib/internationalisation/i18n-helpers";
import {
  Locale,
  MealRecord,
  Messages,
  ViewBy,
} from "@calculories/shared-types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Checkbox from "../Shared/Checkbox";

interface MealRecordCardProps {
  locale: Locale;
  messages: Messages;
  isRefreshing?: boolean;
  record: MealRecord;
  view: ViewBy;
  isChecked: boolean;
  isEditing: boolean;
  onChange: (isChecked: boolean, id: number) => void;
}

export const MealRecordCardSkeleton = () => (
  <div className="flex items-center justify-between gap-4 rounded-xl border-[0.5px] border-gray-200 bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD]">
    <div className="flex gap-4">
      <div className="h-20 w-20 animate-pulse self-center rounded-md bg-gray-200" />
      <div className="flex w-42.5 flex-col justify-center gap-1.5">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
        <span className="flex gap-2">
          <div className="h-4 w-12 animate-pulse rounded-sm bg-gray-200" />
          <div className="h-4 w-12 animate-pulse rounded-sm bg-gray-200" />
        </span>
      </div>
    </div>
    <div className="h-11.5 w-11.5 animate-pulse rounded-full bg-gray-200" />
  </div>
);

export default function MealRecordCard({
  locale,
  messages,
  isRefreshing,
  record,
  view,
  isChecked,
  isEditing,
  onChange,
}: MealRecordCardProps) {
  const router = useRouter();

  if (isRefreshing) {
    return <MealRecordCardSkeleton />;
  }

  const menuName =
    locale === "en"
      ? record.name_en || record.name_th || "Unknown Menu"
      : record.name_th || record.name_en || "Unknown Menu";

  const imageUrl = "/Home/UnknownMeal.svg";

  const value =
    view === "Calories"
      ? record.total_calorie
      : view === "Protein"
        ? record.total_protein
        : view === "Carbohydrate"
          ? record.total_carbs
          : record.total_fat;
  const formattedValue = value.toLocaleString("en-US");
  const unit = view == "Calories" ? t("kcal", messages) : t("g", messages);

  const handleClick = () => {
    router.push(`history/${record.id}`);
  };

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const time = formatter.format(new Date(record.at));

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border-[0.5px] border-gray-200 bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD] transition-all hover:cursor-pointer">
      <div className="flex w-full items-center gap-4">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isEditing ? "scale-100" : "scale-0"
          }`}
        >
          <Checkbox
            id={record.id.toString()}
            isChecked={isChecked}
            isVisible={isEditing}
            onChange={(isChecked) => onChange(isChecked, record.id)}
          />
        </div>

        {/* Image */}
        <Image
          src={imageUrl}
          alt={menuName}
          width={80}
          height={80}
          className="h-20 w-20 self-center"
        />

        {/* Record information */}
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-grey-60 truncate text-xs font-bold">{time}</p>
          <p className="font-bold text-pretty">{menuName}</p>
          <span className="mt-1 flex gap-1">
            <p className="bg-green-80 rounded-sm py-0.5 pr-1.5 pl-1 text-xs text-white">
              {formattedValue} {unit}
            </p>
          </span>
        </div>

        <button
          className="bg-green-10 hover:bg-green-20 size-14 h-fit rounded-full p-3 transition-all hover:cursor-pointer"
          onClick={handleClick}
          hidden={isEditing}
        >
          <Image
            src="/Icons/EditIcon.svg"
            alt="Edit meal record"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
