// V 1.0.0

// ------------------------------------------------------------------
// Translation Types
// ------------------------------------------------------------------
export type Messages = Record<string, string>;
export type Locale = "en" | "th";
export type Sex = "Female" | "Male" | "Other";
export type Goal = "Balanced" | "Moderate" | "HighProtein" | "Ketogenic";

// ------------------------------------------------------------------
// Base Entity Types
// ------------------------------------------------------------------
export interface DietProfile {
  last_updated: string; // ISO datetime string
  calorie_intake: number;
  carbs_intake: number;
  protein_intake: number;
  fat_intake: number;
  alcohol_intake: number;
  streak: number;
}

export interface User {
  id: string; // uuid
  username: string;
  email: string;
  dob: string; // ISO datetime string
  sex: string;
  weight: number;
  height: number;
  created_at: string; // ISO datetime string
  activity_level: number;
  vegetarian_default: boolean;
  target_protein: number;
  target_carbs: number;
  target_calories: number;
  target_fats: number;
}

export interface UpdateUserDto {
  username?: string;
  dob?: string;
  sex?: Sex;
  weight?: number;
  height?: number;
  activity_level?: number;
  goal?: Goal;
  vegetarian_default?: boolean;
  no_lactose_default?: boolean;
  no_peanut_default?: boolean;
  gluten_free_default?: boolean;
  halal_default?: boolean;
  no_shellfish_default?: boolean;
  is_setup_finished?: boolean;
}

export interface Component {
  id: number;
  ratio: number;
  name_th: string;
  name_en: string;
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
  alcohol: number;
  is_vegetarian: boolean;
  is_halal: boolean;
  has_shellfish: boolean;
  has_lactose: boolean;
  has_peanut: boolean;
  has_gluten: boolean;
}

export interface Restaurant {
  id?: number;
  name_th: string;
  name_en: string;
  lat?: number;
  lon?: number;
  url?: string;
  has_dine_in?: boolean;
  has_delivery?: boolean;
  type?: string[];
  dishes?: Dish[];
}

export interface Dish {
  id: number;
  name_th: string;
  name_en: string;
  price: number;
  res_id?: number;
  dish_type?: string[];
  restaurant?: Restaurant;
  components?: Component[];
}

export interface MealHistory {
  id: number;
  user_id: string; // uuid
  dish_id: number;
  at: string; // ISO datetime string
  edited_fat: number;
  edited_protein: number;
  edited_carbs: number;
  edited_alcohol: number;
  name_th: string;
  name_en: string;
  res_id: number;
  price: number;
  dish_type?: string[];
  restaurant?: Restaurant;
  components?: Component[];
}

export interface AddMealHistoryDto {
  dish_id: number;
  edited_carbs?: number;
  edited_protein?: number;
  edited_fat?: number;
  edited_alcohol?: number;
}

export interface ComponentNutrition {
  calorie: number;
  protein: number;
  fat: number;
  carbs: number;
}
// ------------------------------------------------------------------
// API Request / Response Payload Types
// ------------------------------------------------------------------

// GET /api/user/:uid
export interface GetUserResponse extends User {
  dietProfile: DietProfile;
}

// PATCH /api/user/:uid
export type UpdateUserRequest = Partial<Omit<User, "id">>;

// PATCH /api/user/:uid/diet-profile
export type UpdateDietProfileRequest = Partial<DietProfile>;

// POST /api/user/meal-history
export type CreateMealHistoryRequest = Omit<MealHistory, "id">;

// DELETE /api/user/meal-history
export interface DeleteMealRecordsByIdsRequest {
  ids: number[];
}

// PATCH /api/user/meal-history/:mid
export type UpdateMealHistoryRequest = Partial<
  Omit<MealHistory, "id" | "user_id" | "dish_id">
>;

// GET /api/dishes
export interface GetDishesByIdsRequest {
  ids: number[];
}

// GET /api/restaurants/:id
export interface GetRestaurantResponse extends Restaurant {
  id: number; // Guaranteed to be present in this response
  dishes: Dish[];
}

// ------------------------------------------------------------------
// Database Raw Response Types
// ------------------------------------------------------------------

export interface RawDishType {
  dish_type: {
    id: number;
    type_en: string;
    type_th: string;
  };
}

export interface RawRestaurantType {
  restaurant_type: {
    id: number;
    type_en: string;
    type_th: string;
  };
}

export interface RawDishComponent {
  ratio: number;
  dish_id: number;
  component: {
    id: number;
    fat: number;
    carbs: number;
    alcohol: number;
    calorie: number;
    name_en: string;
    name_th: string;
    protein: number;
    is_halal: boolean;
    has_gluten: boolean;
    has_peanut: boolean;
    has_lactose: boolean;
    has_shellfish: boolean;
    is_vegetarian: boolean;
  };
  component_id: number;
}
