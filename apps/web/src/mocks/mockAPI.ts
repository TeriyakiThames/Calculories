// V 1.0.0

import {
  User,
  DietProfile,
  GetUserResponse,
  MealHistory,
  Dish,
  Restaurant,
  UpdateUserRequest,
  UpdateDietProfileRequest,
  CreateMealHistoryRequest,
  UpdateMealHistoryRequest,
  DeleteMealRecordsByIdsRequest,
} from "@calculories/shared-types";

export const mockDietProfile: DietProfile = {
  last_updated: new Date().toISOString(),
  calorie_intake: 1450,
  carbs_intake: 120,
  protein_intake: 85,
  fat_intake: 45,
  alcohol_intake: 0,
  streak: 12,
};

export const mockUser: User = {
  id: "user-uuid-1234-5678",
  username: "calculories_tester",
  email: "tester@calculories.com",
  dob: "1998-05-15T00:00:00Z",
  sex: "M",
  weight: 70.5,
  height: 175,
  created_at: "2026-01-10T08:00:00Z",
  activity_level: 1.55,
  vegetarian_default: false,
  target_protein: 150,
  target_carbs: 220,
  target_calories: 2200,
  target_fats: 75,
};

export const mockRestaurant: Restaurant = {
  id: 101,
  name_th: "ร้านอาหารตามสั่งป้าแจ๋ว",
  name_en: "Auntie Jaew's Made-to-Order",
  lat: 13.736717,
  lon: 100.523186,
  url: "https://example.com/jaew",
  has_dine_in: true,
  has_delivery: true,
  type: ["Street Food", "Thai"],
};

export const mockDish: Dish = {
  id: 501,
  name_th: "ข้าวกะเพราหมูสับไข่ดาว",
  name_en: "Basil Minced Pork with Fried Egg over Rice",
  price: 60.0,
  res_id: 101,
  dish_type: ["A la carte", "Spicy", "Stir-fry"],
  restaurant: mockRestaurant,
  components: [
    {
      id: 1,
      ratio: 1.0,
      name_th: "หมูสับ",
      name_en: "Minced Pork",
      calorie: 250.0,
      protein: 20.5,
      fat: 18.0,
      carbs: 0.0,
      alcohol: 0.0,
      is_vegetarian: true,
      is_halal: false,
      has_shellfish: false,
      has_lactose: false,
      has_peanut: false,
      has_gluten: false,
    },
    {
      id: 2,
      ratio: 1.0,
      name_th: "ข้าวหอมมะลิ",
      name_en: "Jasmine Rice",
      calorie: 200.0,
      protein: 4.0,
      fat: 0.5,
      carbs: 45.0,
      alcohol: 0.0,
      is_vegetarian: true,
      is_halal: true,
      has_shellfish: false,
      has_lactose: false,
      has_peanut: false,
      has_gluten: false,
    },
    {
      id: 3,
      ratio: 1.0,
      name_th: "ไข่ดาว",
      name_en: "Fried Egg",
      calorie: 160.0,
      protein: 14.0,
      fat: 12.0,
      carbs: 1.0,
      alcohol: 0.0,
      is_vegetarian: true,
      is_halal: true,
      has_shellfish: false,
      has_lactose: false,
      has_peanut: true,
      has_gluten: false,
    },
    {
      id: 4,
      ratio: 1.0,
      name_th: "น้ำมันและเครื่องเทศ",
      name_en: "Oil & Seasoning",
      calorie: 40.0,
      protein: 0.0,
      fat: 4.5,
      carbs: 1.0,
      alcohol: 0.0,
      is_vegetarian: true,
      is_halal: true,
      has_shellfish: false,
      has_lactose: false,
      has_peanut: false,
      has_gluten: true,
    },
  ],
};

export const mockMealHistoryList: MealHistory[] = [
  {
    id: 1001,
    user_id: mockUser.id,
    dish_id: mockDish.id,
    at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    edited_fat: 35,
    edited_protein: 30,
    edited_carbs: 60,
    edited_alcohol: 0,
    name_th: mockDish.name_th,
    name_en: mockDish.name_en,
    res_id: mockRestaurant.id ?? 101,
    price: mockDish.price,
    restaurant: mockRestaurant,
    components: mockDish.components,
  },
];

const MOCK_RECOMMENDED_DISHES: Dish[] = [
  {
    id: 1,
    name_en: "Grilled Salmon",
    name_th: "แซลมอนย่าง",
    price: 210.0,
    res_id: 101,
    dish_type: ["Healthy", "Seafood", "Keto"],
    restaurant: {
      id: 101,
      name_en: "Green Eats",
      name_th: "กรีนอีทส์",
      lat: 13.7462,
      lon: 100.5348,
      url: "https://example.com/green-eats",
      has_dine_in: true,
      has_delivery: true,
      type: ["Healthy", "Western"],
    },
    components: [
      {
        id: 10,
        ratio: 1.0,
        name_th: "เนื้อปลาแซลมอน",
        name_en: "Salmon Fillet",
        calorie: 300.0,
        protein: 34.0,
        fat: 16.0,
        carbs: 0.0,
        alcohol: 0.0,
        is_vegetarian: false,
        is_halal: true,
        has_shellfish: true,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 11,
        ratio: 1.0,
        name_th: "หน่อไม้ฝรั่ง",
        name_en: "Asparagus",
        calorie: 30.0,
        protein: 3.0,
        fat: 0.2,
        carbs: 5.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 12,
        ratio: 1.0,
        name_th: "น้ำมันมะกอก",
        name_en: "Olive Oil",
        calorie: 100.0,
        protein: 0.0,
        fat: 14.0,
        carbs: 0.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
    ],
  },
  {
    id: 2,
    name_en: "Quinoa Buddha Bowl",
    name_th: "ควินัวบุดด้าโบลว์",
    price: 185.0,
    res_id: 102,
    dish_type: ["Vegan", "Salad", "Healthy"],
    restaurant: {
      id: 102,
      name_en: "Healthy Hub",
      name_th: "เฮลตี้ฮับ",
      lat: 13.7314,
      lon: 100.5413,
      url: "https://example.com/healthy-hub",
      has_dine_in: true,
      has_delivery: true,
      type: ["Vegan", "Salad"],
    },
    components: [
      {
        id: 14,
        ratio: 1.0,
        name_th: "ควินัว",
        name_en: "Quinoa",
        calorie: 120.0,
        protein: 4.4,
        fat: 1.9,
        carbs: 21.3,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 15,
        ratio: 1.0,
        name_th: "ถั่วชิกพีอบ",
        name_en: "Roasted Chickpeas",
        calorie: 110.0,
        protein: 5.9,
        fat: 2.0,
        carbs: 18.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 16,
        ratio: 1.0,
        name_th: "อะโวคาโด",
        name_en: "Avocado",
        calorie: 100.0,
        protein: 1.0,
        fat: 9.0,
        carbs: 5.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 17,
        ratio: 1.0,
        name_th: "น้ำสลัดทาฮินี",
        name_en: "Tahini Dressing",
        calorie: 50.0,
        protein: 1.5,
        fat: 4.0,
        carbs: 2.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
    ],
  },
  {
    id: 3,
    name_en: "Zucchini Pesto Pasta",
    name_th: "พาสต้าซุกกินีเปสโต",
    price: 240.0,
    res_id: 103,
    dish_type: ["Italian", "Low Carb", "Vegetarian"],
    restaurant: {
      id: 103,
      name_en: "Pasta Fresh",
      name_th: "พาสต้าเฟรช",
      lat: 13.7259,
      lon: 100.5235,
      url: "https://example.com/pasta-fresh",
      has_dine_in: true,
      has_delivery: true,
      type: ["Italian", "Healthy"],
    },
    components: [
      {
        id: 18,
        ratio: 1.0,
        name_th: "เส้นบะหมี่บวบ",
        name_en: "Zucchini Noodles",
        calorie: 60.0,
        protein: 2.0,
        fat: 0.5,
        carbs: 10.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 19,
        ratio: 1.0,
        name_th: "ซอสเพสโต้",
        name_en: "Pesto Sauce",
        calorie: 250.0,
        protein: 3.0,
        fat: 24.0,
        carbs: 2.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: true,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 20,
        ratio: 1.0,
        name_th: "มะเขือเทศเชอร์รี่",
        name_en: "Cherry Tomatoes",
        calorie: 30.0,
        protein: 1.0,
        fat: 0.2,
        carbs: 6.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: false,
        has_peanut: false,
        has_gluten: false,
      },
      {
        id: 21,
        ratio: 1.0,
        name_th: "ชีสพาร์เมซาน",
        name_en: "Parmesan Cheese",
        calorie: 180.0,
        protein: 17.0,
        fat: 12.0,
        carbs: 1.0,
        alcohol: 0.0,
        is_vegetarian: true,
        is_halal: true,
        has_shellfish: false,
        has_lactose: true,
        has_peanut: false,
        has_gluten: false,
      },
    ],
  },
];

export const MockAPI = {
  // GET /api/user/:uid
  getUserProfile: async (uid: string): Promise<GetUserResponse> => {
    console.log(`MockAPI: Fetching user profile.`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...mockUser,
      id: uid,
      dietProfile: mockDietProfile,
    };
  },

  // GET /api/user/:uid/meal-history
  getMealHistory: async (uid: string): Promise<MealHistory[]> => {
    console.log(`MockAPI: Fetching meal history.`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockMealHistoryList.filter(
      (meal) => meal.user_id === mockUser.id || uid,
    );
  },

  // GET /api/dishes/:id
  getDishInfo: async (id: number): Promise<Dish | null> => {
    console.log(`MockAPI: Fetching dish info for id: ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const foundDish = MOCK_RECOMMENDED_DISHES.find((dish) => dish.id === id);
    return foundDish || null;
  },

  // GET /api/restaurants/:id
  getRestaurantInfo: async (
    id: number,
  ): Promise<Restaurant & { dishes: Dish[] }> => {
    console.log(`MockAPI: Fetching restaurant info for id: ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      ...mockRestaurant,
      id,
      dishes: [mockDish],
    };
  },

  updateUserProfile: async (
    uid: string,
    data: UpdateUserRequest,
  ): Promise<User> => {
    console.log(`MockAPI: Updating user profile.`, data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      ...mockUser,
      ...data,
      id: uid,
    };
  },

  updateDietProfile: async (
    uid: string,
    data: UpdateDietProfileRequest,
  ): Promise<DietProfile> => {
    console.log(`MockAPI: Updating diet profile.`, data);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      ...mockDietProfile,
      ...data,
      last_updated: new Date().toISOString(),
    };
  },

  addMealHistory: async (
    uid: string,
    data: CreateMealHistoryRequest,
  ): Promise<MealHistory> => {
    console.log(`MockAPI: Adding meal history.`, data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newMeal: MealHistory = {
      ...data,
      id: Math.floor(Math.random() * 10000) + 2000,
      user_id: uid,
    } as MealHistory;
    return newMeal;
  },

  updateMealHistory: async (
    uid: string,
    mid: number,
    data: UpdateMealHistoryRequest,
  ): Promise<MealHistory> => {
    console.log(`MockAPI: Updating meal history ${mid}.`, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...mockMealHistoryList[0],
      ...data,
      id: mid,
      user_id: uid,
    };
  },

  // DELETE /api/user/:uid/meal-history/:mid
  deleteMealHistory: async (
    uid: string,
    mid: number,
  ): Promise<{ success: boolean; id: number }> => {
    console.log(`MockAPI: Deleting meal history ${mid}.`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, id: mid };
  },

  // DELETE /api/user/:uid/meal-history (Bulk delete)
  deleteManyMealHistory: async (
    uid: string,
    data: DeleteMealRecordsByIdsRequest,
  ): Promise<{ success: boolean; deletedCount: number }> => {
    console.log(`MockAPI: Bulk deleting meal history.`, data.ids);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, deletedCount: data.ids.length };
  },

  // TODO: Add this route to backend too
  getRecommendedDishes: async (uid: string): Promise<Dish[]> => {
    console.log(`MockAPI: Fetching recommended dishes.`);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const shuffledDishes = [...MOCK_RECOMMENDED_DISHES].sort(
      () => 0.5 - Math.random(),
    );
    return shuffledDishes;
  },
};
