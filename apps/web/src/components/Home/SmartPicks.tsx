import Image from "next/image";
import { RefreshIcon } from "../../../public/Icons/Refresh";
import { t, Messages } from "@/lib/i18n";

interface Meal {
  restaurant: string;
  menu: string;
  calories?: number;
  distance: number;
  price: number;
  imageUrl?: string;
}

interface SmartPicksProps {
  meals?: Meal[];
  messages: Messages;
}

const Header = ({ messages }: { messages: Messages }) => (
  <div className="flex justify-between">
    <h1 className="text-xl font-bold">{t("smart_picks_title", messages)}</h1>

    {/* TODO: Add functionality to refresh icon when backend is complete */}
    <button
      className="text-primary-green-1 flex items-center gap-1 hover:text-gray-400"
      aria-label="Refresh"
    >
      <RefreshIcon />
      <h2 className="font-bold">{t("refresh_label", messages)}</h2>
    </button>
  </div>
);

const MealCard = ({
  restaurant = "unknown",
  menu = "unknown",
  calories = 0,
  distance = 0,
  price = 0,
  imageUrl = "/Home/UnknownMeal.svg",
}: Meal) => (
  <div className="flex h-24 items-center justify-between gap-10.75 rounded-xl border-[0.5px] border-[#4AAE9B] bg-white px-4 py-2 shadow-[0_2.38px_2.38px_0_#CAE1DD]">
    <div className="flex gap-4">
      {/* Image */}
      <Image
        src={imageUrl}
        alt={menu}
        width={80}
        height={80}
        className="h-20 w-20"
      />

      {/* Restaurant information */}
      <div className="flex w-42.5 flex-col gap-1">
        <h3 className="text-primary-green-1 w-42.5 translate-y-1 truncate text-xs font-bold">
          {restaurant}
        </h3>
        <h2 className="w-42.5 truncate font-bold">{menu}</h2>
        <span className="flex gap-1">
          <p className="rounded-sm bg-[#dcdcdc] px-1 py-0.5 text-xs text-[#777E7D]">
            {calories} kcal
          </p>
          <p className="rounded-sm bg-[#dcdcdc] px-1 py-0.5 text-xs text-[#777E7D]">
            {distance} km
          </p>
        </span>
      </div>
    </div>

    {/* Price */}
    <h1 className="font-bold text-[#8E8E93]">฿{price}</h1>
  </div>
);

export default function SmartPicks({ meals = [], messages }: SmartPicksProps) {
  return (
    <div className="mx-4.5 flex flex-col gap-3">
      <Header messages={messages} />
      {meals.map((meal, index) => (
        <MealCard key={index} {...meal} />
      ))}
      {meals.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          {t("no_recommendations", messages)}
        </p>
      )}
    </div>
  );
}
