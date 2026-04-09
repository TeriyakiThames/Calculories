import { Locale, Restaurant } from "@calculories/shared-types";
import Link from "next/link";
import BackButton from "../Shared/BackButton";
import { Button } from "../Shared/Button";
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
          className="h-20 w-20 rounded-md object-cover"
        />
        <span>
          <h1 className="text-grey-100 flex text-2xl leading-tight font-bold">
            {restaurant.name_en}
          </h1>
          <p className="text-grey-60 mt-1 text-xs font-bold">
            {restaurant.restaurant_types
              .map((type) => type.type_en)
              .join(" • ")}
          </p>
        </span>
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
