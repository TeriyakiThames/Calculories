import { loadMessages, t } from "@/lib/i18n";
import LocaleSwitcher from "@/components/Shared/LocaleSwitcher";
import TopBar from "@/components/Home/TopBar";
import Streak from "@/components/Home/Streak";
import CalorieGoals from "@/components/Home/CalorieGoals";
import SmartPicks from "@/components/Home/SmartPicks";
import SearchBar from "@/components/Home/SearchBar";
import PageBottom from "@/components/Shared/PageBottom";

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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: "en" | "th" }>;
}) {
  const { locale } = await params;
  const messages = loadMessages(locale, ["common", "home"]);

  return (
    <main>
      {/* <LocaleSwitcher locale={locale} /> */}
      {/* <h1>{t("home.title", messages)}</h1>
      <p>{t("home.subtitle", messages)}</p> */}

      <TopBar name={"Thames"} />
      <Streak date={5} />
      <CalorieGoals calories={1200} protein={85} carbs={145} fats={45} />
      <SmartPicks meals={MOCK_RECOMMENDED_MEALS} />
      <h2 className="mt-6 pb-3 text-center text-xs text-[#8E8E93]">
        Not feeling these? Search manually!
      </h2>
      <SearchBar />
      <PageBottom />
    </main>
  );
}
