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
  DeleteMealHistoryRequest,
} from "@calculories/shared-types";

// ------------------------------------------------------------------
// 1. Mock Entities
// ------------------------------------------------------------------

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
  activity_level: 1.55, // e.g., moderately active
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
  price: 60,
  res_id: 101,
  calorie: 650,
  is_vegetarian: false,
  restaurant: mockRestaurant,
  components: [
    { component_id: 1, ratio: 1, name: "Minced Pork", calorie: 250 },
    { component_id: 2, ratio: 1, name: "Rice", calorie: 200 },
    { component_id: 3, ratio: 1, name: "Fried Egg", calorie: 160 },
    { component_id: 4, ratio: 1, name: "Oil & Seasoning", calorie: 40 },
  ],
};

export const mockMealHistoryList: MealHistory[] = [
  {
    id: 1001,
    user_id: mockUser.id,
    dish_id: mockDish.id,
    at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
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

// ------------------------------------------------------------------
// 2. Mock API Responses
// ------------------------------------------------------------------

export const MockAPI = {
  // GET /api/user/:uid
  getUserProfile: async (uid: string): Promise<GetUserResponse> => {
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...mockUser,
      id: uid, // echo back the requested ID
      dietProfile: mockDietProfile,
    };
  },

  // GET /api/user/:uid/meal-history
  getMealHistory: async (uid: string): Promise<MealHistory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockMealHistoryList.filter(
      (meal) => meal.user_id === mockUser.id || uid,
    );
  },

  // GET /api/dishes/:id
  getDishInfo: async (id: number): Promise<Dish> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      ...mockDish,
      id,
    };
  },

  // GET /api/restaurants/:id
  getRestaurantInfo: async (
    id: number,
  ): Promise<Restaurant & { dishes: Dish[] }> => {
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
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate latency
    console.log(`Mocking user update for ${uid}:`, data);
    return {
      ...mockUser,
      ...data, // Merge the new data over the mock user
      id: uid,
    };
  },

  // PATCH /api/user/:uid/diet-profile
  updateDietProfile: async (
    uid: string,
    data: UpdateDietProfileRequest,
  ): Promise<DietProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`Mocking diet profile update for ${uid}:`, data);
    return {
      ...mockDietProfile,
      ...data,
      last_updated: new Date().toISOString(), // Automatically update timestamp
    };
  },

  // POST /api/user/:uid/meal-history
  addMealHistory: async (
    uid: string,
    data: CreateMealHistoryRequest,
  ): Promise<MealHistory> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Mocking adding meal for ${uid}:`, data);

    // Create a fake new record with a random ID
    const newMeal: MealHistory = {
      ...data,
      id: Math.floor(Math.random() * 10000) + 2000,
      user_id: uid,
    };

    return newMeal;
  },

  // PATCH /api/user/:uid/meal-history/:mid
  updateMealHistory: async (
    uid: string,
    mid: number,
    data: UpdateMealHistoryRequest,
  ): Promise<MealHistory> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Mocking updating meal ${mid} for ${uid}:`, data);

    return {
      ...mockMealHistoryList[0], // Grab a base mock meal
      ...data, // Apply the updates
      id: mid,
      user_id: uid,
    };
  },

  // DELETE /api/user/:uid/meal-history/:mid
  deleteMealHistory: async (
    uid: string,
    mid: number,
  ): Promise<{ success: boolean; id: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`Mocking deleting meal ${mid} for ${uid}`);
    return { success: true, id: mid };
  },

  // DELETE /api/user/:uid/meal-history (Bulk delete)
  deleteManyMealHistory: async (
    uid: string,
    data: DeleteMealHistoryRequest,
  ): Promise<{ success: boolean; deletedCount: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log(`Mocking bulk deleting meals for ${uid}:`, data.id);
    return { success: true, deletedCount: data.id.length };
  },
};
