import { Locale, Restaurant } from "@calculories/shared-types";
import Link from "next/link";
import BackButton from "../Shared/BackButton";
import { Button } from "../Shared/Button";

// can they make this a global component?
function Tag({
  color,
  text,
  hasIcon,
}: {
  color: "green" | "red";
  text: string;
  hasIcon?: boolean;
}) {
  const styles = {
    green: "border-green-100 text-green-100 bg-green-1",
    red: "border-red-100 text-red-100 bg-red-1",
  };
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs leading-none ${styles[color]}`}
    >
      <span className="whitespace-nowrap">{text}</span>
      {hasIcon && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="6.66667"
            stroke="currentColor"
            strokeWidth="1.33333"
          />
          <path
            d="M8 10.6667V8"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
          />
          <circle cx="8" cy="5.33301" r="0.666667" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  locale: Locale;
}

export default function RestaurantHeader({
  restaurant,
  locale,
}: RestaurantHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between">
      {/* Return button and restaurant profile */}
      <h1 className="text-grey-100 relative flex w-full items-center justify-center py-5 text-xl font-bold">
        <BackButton containerClassName="absolute left-0" />
        Restaurant Profile
      </h1>

      {/* Restaurant info */}
      <span className="flex gap-5">
        <img
          src={"/Restaurant/MockRestaurant.png"}
          alt="Restaurant picture"
          className="h-22 w-22 rounded-md object-cover"
        />
        <div className="flex h-full flex-col">
          <h1 className="text-grey-100 flex text-2xl leading-tight font-bold">
            {restaurant.name_en}
          </h1>
          <p className="text-grey-60 mt-1 text-xs font-bold">
            {restaurant.restaurant_types
              .map((type) => type.type_en)
              .join(" • ")}
          </p>
          {restaurant.is_halal && (
            <div className="mt-2.5">
              <Tag color="green" text="Halal Restaurant" hasIcon />
            </div>
          )}
        </div>
      </span>

      {/* Map button */}
      <Link href={restaurant.url} className="w-full">
        <Button className="text-1xl mt-3 flex items-center justify-center gap-1 py-5 font-semibold">
          <img src="/Icons/Map.svg" alt="Map button" className="h-5 w-5" />
          <span>Open in Maps</span>
        </Button>
      </Link>
    </div>
  );
}
