"use client";

import useUser from "@/hooks/useUser";
import LocaleSwitcher, { Locale } from "@/components/Shared/LocaleSwitcher";
import AuthButton from "@/components/Shared/AuthButton";
import TopBar from "@/components/Home/TopBar";
import Streak from "@/components/Home/Streak";
import CalorieGoals from "@/components/Home/CalorieGoals";
import SmartPicks from "@/components/Home/SmartPicks";
import SearchBar from "@/components/Home/SearchBar";
import PageBottom from "@/components/Shared/PageBottom";
import { Messages } from "@/lib/internationalisation/i18n-helpers";
import DeleteAccountButton from "@/components/Shared/DeleteAccountButton";

const MOCK_RECOMMENDED_MEALS = [
  {
    restaurant: "Green Eats",
    menu: "Grilled Salmon",
    calories: 450,
    distance: 10,
    price: 210,
    imageUrl: "/Home/UnknownMeal.svg",
  },
  {
    restaurant: "Healthy Hub",
    menu: "Quinoa Buddha Bowl",
    calories: 380,
    distance: 1.2,
    price: 185,
    imageUrl: "/Home/UnknownMeal.svg",
  },
  {
    restaurant: "Pasta Fresh",
    menu: "Zucchini Pesto Pasta",
    calories: 520,
    distance: 3.5,
    price: 240,
    imageUrl: "/Home/UnknownMeal.svg",
  },
];

export default function HomeClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { loading, error, user } = useUser();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <span>Loading user data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-center gap-10 border border-black bg-white">
        <LocaleSwitcher locale={locale} />
        <AuthButton messages={messages} />
        <DeleteAccountButton messages={messages}/>
      </div>
      {user ? (
        <>
          <TopBar
            name={user.user_metadata.name}
            imageURL={
              user.user_metadata?.avatar_url || "/Home/MockProfilePicture.svg"
            }
            messages={messages}
          />
        </>
      ) : (
        <TopBar name={"User"} messages={messages} />
      )}

      <Streak date={5} messages={messages} />
      <CalorieGoals
        calories={1200}
        protein={85}
        carbs={145}
        fats={45}
        messages={messages}
      />
      <SmartPicks meals={MOCK_RECOMMENDED_MEALS} messages={messages} />
      <SearchBar messages={messages} />
      <PageBottom />
    </main>
  );
}
