// ------------------------------------------------------------------
// Translation Types
// ------------------------------------------------------------------
export type Messages = Record<string, string>;
export type Locale = "en" | "th";
export type Sex = "Female" | "Male" | "Other";
export type Goal = "Balanced" | "Moderate" | "HighProtein" | "Ketogenic";
export type SortBy =
  | "price"
  | "total_calorie"
  | "total_protein"
  | "total_fat"
  | "total_carbs"
  | "distance";
export type ViewBy = "Calories" | "Protein" | "Carbohydrate" | "Fat";

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

export interface User extends DietaryPreferences {
  id: string; // uuid
  username: string;
  email: string;
  dob: string; // ISO datetime string
  sex: string;
  weight: number;
  height: number;
  goal: Goal;
  created_at: string; // ISO datetime string
  activity_level: number;
  target_protein: number;
  target_carbs: number;
  target_calorie: number;
  target_fat: number;
}

export interface UserLocation {
  userLat?: number;
  userLon?: number;
}

export interface DietaryPreferences {
  vegetarian_default: boolean;
  no_lactose_default: boolean;
  no_peanut_default: boolean;
  gluten_free_default: boolean;
  halal_default: boolean;
  no_shellfish_default: boolean;
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
  weight_g: number;
  is_vegetarian: boolean;
  is_halal: boolean;
  has_shellfish: boolean;
  has_lactose: boolean;
  has_peanut: boolean;
  has_gluten: boolean;
}

export interface ComponentWithNewRatio extends Component {
  new_ratio: number;
}

export interface TypeItem {
  id: number;
  type_en: string;
  type_th: string;
}

export interface Restaurant {
  id: number;
  name_th: string;
  name_en: string;
  lat: number;
  lon: number;
  url: string;
  has_dine_in: boolean;
  has_delivery: boolean;
  is_halal: boolean;
  restaurant_types: TypeItem[];
  dishes: Dish[];
}

export interface Dish {
  id: number;
  name_th: string;
  name_en: string;
  price: number;
  res_id: number;
  dish_types: TypeItem[];
  restaurant: Restaurant;
  components: Component[];
  total_calorie: number;
  total_protein: number;
  total_fat: number;
  total_carbs: number;
  total_alcohol: number;
  is_vegetarian: boolean;
  is_halal: boolean;
  has_shellfish: boolean;
  has_lactose: boolean;
  has_peanut: boolean;
  has_gluten: boolean;
}

export type DishRestaurant = Omit<Restaurant, "dishes">;

export type DishNoComp = Omit<Dish, "components">;

// TODO: change this to MealRecord? but where is this used...
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

// TODO: discuss w/ king abt having both edited_ and total_ in the same layer...
export interface MealRecord {
  id: number;
  user_id: string;
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
  is_halal: boolean;
  has_gluten: boolean;
  has_peanut: boolean;
  has_lactose: boolean;
  has_shellfish: boolean;
  is_vegetarian: boolean;
  total_fat: number;
  total_carbs: number;
  total_alcohol: number;
  total_calorie: number;
  total_protein: number;
}

export interface Reason {
  type: string;
  emoji: string;
  explanation: string;
}

export interface LocationType {
  latitude: number | null;
  longitude: number | null;
}

// ------------------------------------------------------------------
// API Request / Response Payload Types
// ------------------------------------------------------------------

// GET /api/user/:uid
export interface GetUserResponse extends User {
  diet_profile: DietProfile;
}

// PATCH /api/user/:uid
// export type UpdateUserRequest = Partial<Omit<User, "id">>;
export interface UpdateUserDto extends Partial<DietaryPreferences> {
  username?: string;
  dob?: string;
  sex?: Sex;
  weight?: number;
  height?: number;
  activity_level?: number;
  goal?: Goal;
  is_setup_finished?: boolean;
}

// PATCH /api/user/:uid/diet-profile
export type UpdateDietProfileRequest = Partial<DietProfile>;

// POST /api/user/meal-history
export interface CreateMealHistoryRequest {
  dish_id: number;
  edited_carbs?: number;
  edited_protein?: number;
  edited_fat?: number;
  edited_alcohol?: number;
}

// DELETE /api/user/meal-history
export interface DeleteMealRecordsByIdsRequest {
  ids: number[];
}

// PATCH /api/user/meal-history/:mid
export type UpdateMealHistoryRequest = Partial<
  Pick<
    MealHistory,
    "at" | "edited_carbs" | "edited_protein" | "edited_fat" | "edited_alcohol"
  >
>;

// GET /api/dishes
export interface GetDishesByIdsRequest {
  ids: number[];
}

// POST /api/dishes/search
export interface GetDishesBySearchRequest {
  search_string?: string;
  sort_by?: SortBy;
  ascending?: boolean;
  dish_type_ids?: number[];
  restaurant_type_ids?: number[];
  has_dine_in?: boolean; // false means not configured (apply to all options accept 'ascending')
  has_delivery?: boolean;
  restaurant_is_halal?: boolean;
  is_vegetarian?: boolean;
  dish_is_halal?: boolean;
  no_gluten?: boolean;
  no_lactose?: boolean;
  no_peanut?: boolean;
  no_shellfish?: boolean;
  from: number;
  to: number;
  user?: GetUserResponse;
  location?: LocationType;
  language?: Locale;
}

// GET /api/restaurants/:id
export interface GetRestaurantResponse extends Restaurant {
  id: number; // Guaranteed to be present in this response
  dishes: Dish[];
}

// PATCH and POST /api/meal-history/[mid] on ratios edited
export interface setOrUpdateMealRecordRatiosRequest {
  edited_carbs: number;
  edited_protein: number;
  edited_fat: number;
  edited_alcohol: number;
}

// POST https://calculories-ai-recommender.onrender.com/explain/meal
export interface GetWhyThisWorksForYouRequest {
  user: {
    goal: Goal;
    target_calorie: number;
    target_protein: number;
    target_fat: number;
    target_carbs: number;
    dietary_restrictions: {
      vegetarian: boolean;
      no_shellfish: boolean;
      no_lactose: boolean;
      no_peanut: boolean;
      gluten_free: boolean;
      halal: boolean;
    };
    diet_profile: {
      calorie_intake: number;
      protein_intake: number;
      fat_intake: number;
      carbs_intake: number;
    };
    location: {
      latitude: number;
      longitude: number;
    };
    language: Locale;
  };
  dish: {
    id: string;
    name_en: string;
    name_th: string;
    restaurant_name_en: string;
    restaurant_name_th: string;
    restaurant_type: string[];
    price_thb: number;
    nutrition: {
      calories: number;
      protein_g: number;
      fat_g: number;
      carbs_g: number;
      fiber_g: number;
    };
  };
}

// POST https://calculories-ai-recommender.onrender.com/explain/meal
export interface GetWhyThisWorksForYouResponse {
  reasons: Reason[];
}

// POST https://calculories-ai-recommender.onrender.com/recommend/home
export interface GetRecommendedDishesRequest {
  user: {
    goal: Goal | string;
    target_calorie: number;
    target_protein: number;
    target_fat: number;
    target_carbs: number;
    dietary_restrictions: {
      vegetarian: boolean;
      no_shellfish: boolean;
      no_lactose: boolean;
      no_peanut: boolean;
      has_gluten: boolean;
      halal: boolean;
    };
    diet_profile: {
      calorie_intake: number;
      protein_intake: number;
      fat_intake: number;
      carbs_intake: number;
    };
    location: {
      latitude: number;
      longitude: number;
    };
    language: Locale | string;
  };
  screen: string;
  top_n: number;
  sort_by_distance: boolean;
  preference?: {
    selected_pills: string[];
    custom_text: string;
  };
}

// POST https://calculories-ai-recommender.onrender.com/recommend/home
export interface GetRecommendedDishesResponse {
  dish_ids: string[] | number[];
}

// POST https://calculories-ai-recommender.onrender.com/recommend/restaurant
export interface getRecommendByRestaurantRequest {
  user: {
    goal: Goal;
    target_calorie: number;
    target_protein: number;
    target_fat: number;
    target_carbs: number;
    dietary_restrictions: {
      vegetarian: boolean;
      no_shellfish: boolean;
      no_lactose: boolean;
      no_peanut: boolean;
      gluten_free: boolean;
      halal: boolean;
    };
    diet_profile: {
      calorie_intake: number;
      protein_intake: number;
      fat_intake: number;
      carbs_intake: number;
    };
    location: {
      latitude: number;
      longitude: number;
    };
    language: Locale;
  };
  screen: string;
  restaurant_id: string;
  top_n: number;
}

// POST https://calculories-ai-recommender.onrender.com/recommend/restaurant
export interface getRecommendByRestaurantResponse {
  dish_ids: string[];
  screen: string;
  restaurant_id: string;
  total: number;
}
// ------------------------------------------------------------------
// Database Raw Response Types
// ------------------------------------------------------------------

export interface RawDishType {
  dish_type: TypeItem;
}

export interface RawRestaurantType {
  restaurant_type: TypeItem;
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

export interface RawDishData {
  id: number;
  name_th: string;
  name_en: string;
  res_id: number;
  price: number;
  dish_type_map: RawDishType[];
  restaurant: {
    id: number;
    lat: number;
    lon: number;
    url: string;
    name_en: string;
    name_th: string;
    is_halal: boolean;
    has_dine_in: boolean;
    has_delivery: boolean;
    restaurant_type_map: RawRestaurantType[];
  };
}

export interface RawDishSumViewData {
  id: number;
  name_th: string;
  name_en: string;
  res_id: number;
  price: number;
  dish_type_map: RawDishType[];
  total_calorie: number;
  total_protein: number;
  total_fat: number;
  total_carbs: number;
  total_alcohol: number;
  is_vegetarian: boolean;
  is_halal: boolean;
  has_shellfish: boolean;
  has_lactose: boolean;
  has_peanut: boolean;
  has_gluten: boolean;
}
