import { Locale, Dish } from "@calculories/shared-types";
import { MockAPI } from "@/mocks/mockAPI";
import BackButton from "@/components/Shared/BackButton";
import Image from "next/image";
import { NutritionalInfo } from "@/components/MealDetails/NutritionalInfo";
import { MealHeader } from "@/components/MealDetails/MealHeader";
import { AiSummary } from "@/components/MealDetails/AiSummary";
import { Button } from "@/components/Shared/Button";
import { IngredientsDropdown } from "@/components/MealDetails/IngredientsDropdown";
import { notFound } from "next/navigation";

interface DishDetailPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export default async function DishDetailPage(props: DishDetailPageProps) {
  const { id } = await props.params;
  const dishId = parseInt(id, 10);

  const dish = (await MockAPI.getDishInfo(dishId)) as Dish;

  if (!dish) {
    // TODO: Add a separate dish not found page?
    notFound();
  }

  return (
    <main className="relative pb-28">
      <BackButton
        hasBg={true}
        containerClassName="absolute top-3.5 left-3 z-10"
      />
      <Image
        src={"/Dish/MockDish.png"}
        width={420}
        height={335}
        alt="Dish image"
        priority
        className="h-auto w-full object-cover"
      />
      <div className="relative z-10 -mt-17 flex flex-col gap-7.5 rounded-t-3xl bg-white p-8.75">
        <MealHeader dish={dish} />
        <NutritionalInfo dish={dish} />
        <AiSummary />
        <div className="bg-grey-40 my h-[0.5px] w-full" />
        <IngredientsDropdown dish={dish} />
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-20 mx-auto w-full max-w-105 border-t border-[#8e8e93] bg-[#f6f7f7] px-9 py-7">
        <Button>Add Meal</Button>
      </div>
    </main>
  );
}
