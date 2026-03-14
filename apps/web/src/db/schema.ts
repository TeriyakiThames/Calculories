import {
  pgTable,
  pgEnum,
  check,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  date,
  real,
  decimal,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

const sexEnum = pgEnum("sex", ["M", "F"]);
const goalEnum = pgEnum("goal", [
  "balanced",
  "moderate",
  "highProtein",
  "ketogenic",
]);

// Tables =============================

export const userTable = pgTable(
  "user",
  {
    id: uuid().primaryKey(),
    username: text().notNull(),
    email: text().notNull().unique(),
    dob: date(),
    sex: sexEnum(),
    weight: real(),
    height: integer(),
    activity_level: real(),
    created_at: timestamp({ mode: "date", precision: 3, withTimezone: true })
      .defaultNow()
      .notNull(),

    vegetarian_default: boolean().default(false).notNull(),
    halal_default: boolean().default(false).notNull(),
    no_seafood_default: boolean().default(false).notNull(),
    no_lactose_default: boolean().default(false).notNull(),
    no_peanut_default: boolean().default(false).notNull(),
    gluten_free_default: boolean().default(false).notNull(),

    goal: goalEnum().default("balanced").notNull(),
    target_calorie: real(),
    target_fat: real(),
    target_protein: real(),
    target_carbs: real(),
  },
  (table) => [
    check(
      "activity_level check",
      sql`${table.activity_level} IN (1.2, 1.375, 1.55, 1.725, 1.9)`,
    ),
  ],
).enableRLS();

export const dietProfileTable = pgTable("diet_profile", {
  user_id: uuid()
    .primaryKey()
    .references(() => userTable.id, { onDelete: "cascade" }),
  last_updated: timestamp({ mode: "date", precision: 3, withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  calorie_intake: real().default(0).notNull(),
  carbs_intake: real().default(0).notNull(),
  protein_intake: real().default(0).notNull(),
  fat_intake: real().default(0).notNull(),
  alcohol_intake: real().default(0).notNull(),
  streak: integer().default(0).notNull(),
}).enableRLS();

export const restaurantTable = pgTable("restaurant", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name_th: text().notNull(),
  name_en: text().notNull(),
  lat: decimal({ precision: 9, scale: 7 }),
  lon: decimal({ precision: 10, scale: 7 }),
  url: text().notNull(),
  has_dine_in: boolean().notNull(),
  has_delivery: boolean().notNull(),
}).enableRLS();

export const restaurantTypeTable = pgTable("restaurant_type", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: text().notNull(),
}).enableRLS();

export const restaurantTypeMap = pgTable("restaurant_type_map", {
  res_id: integer()
    .notNull()
    .references(() => restaurantTable.id, { onDelete: "cascade" }),
  type_id: integer()
    .notNull()
    .references(() => restaurantTypeTable.id, { onDelete: "cascade" }),
}).enableRLS();

export const dishTable = pgTable("dish", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name_th: text().notNull(),
  name_en: text().notNull(),
  res_id: integer().notNull(),
  price: real().notNull(),
}).enableRLS();

export const componentTable = pgTable("component", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  calorie: real().notNull(),
  protein: real().notNull(),
  carbs: real().notNull(),
  fat: real().notNull(),

  is_vegetarian: boolean().default(false).notNull(),
  is_halal: boolean().default(false).notNull(),
  has_seafood: boolean().default(false).notNull(),
  has_lactose: boolean().default(false).notNull(),
  has_peanut: boolean().default(false).notNull(),
  has_gluten: boolean().default(false).notNull(),
}).enableRLS();

export const mealHistoryTable = pgTable("meal_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid().references(() => userTable.id, { onDelete: "cascade" }),
  dish_id: integer().references(() => dishTable.id, { onDelete: "cascade" }),
  at: timestamp({ mode: "date", precision: 3, withTimezone: true })
    .defaultNow()
    .notNull(),

  edited_carbs: real().default(0).notNull(),
  edited_protein: real().default(0).notNull(),
  edited_fat: real().default(0).notNull(),
  edited_alcohol: real().default(0).notNull(),
}).enableRLS();

export const dishComponentMap = pgTable("dish_component_map", {
  dish_id: integer()
    .notNull()
    .references(() => dishTable.id, { onDelete: "cascade" }),
  component_id: integer()
    .notNull()
    .references(() => componentTable.id, { onDelete: "cascade" }),
  ratio: real().default(1).notNull(),
}).enableRLS();

// Relations =============================

export const usersRelations = relations(userTable, ({ one, many }) => ({
  dietProfile: one(dietProfileTable),
  mealHistory: many(mealHistoryTable),
}));

export const dishRelations = relations(dishTable, ({ one, many }) => ({
  mealHistory: many(mealHistoryTable),
  restaurant: one(restaurantTable, {
    fields: [dishTable.res_id],
    references: [restaurantTable.id],
  }),
  dishComponentMap: many(dishComponentMap),
}));

export const restaurantRelations = relations(restaurantTable, ({ many }) => ({
  dishTable: many(dishTable),
  restaurantType: many(restaurantTypeMap),
}));

export const restaurantTypeRelations = relations(
  restaurantTypeTable,
  ({ many }) => ({
    restaurantType: many(restaurantTypeMap),
  }),
);

export const componentRelations = relations(componentTable, ({ many }) => ({
  dishComponentMap: many(dishComponentMap),
}));

export const mealHistoryRelations = relations(mealHistoryTable, ({ one }) => ({
  user: one(userTable, {
    fields: [mealHistoryTable.user_id],
    references: [userTable.id],
  }),
  dish: one(dishTable, {
    fields: [mealHistoryTable.dish_id],
    references: [dishTable.id],
  }),
}));

export const dishComponentMapRelations = relations(
  dishComponentMap,
  ({ one }) => ({
    dish: one(dishTable, {
      fields: [dishComponentMap.dish_id],
      references: [dishTable.id],
    }),
    component: one(componentTable, {
      fields: [dishComponentMap.component_id],
      references: [componentTable.id],
    }),
  }),
);

export const restaurantTypeMapRelations = relations(
  restaurantTypeMap,
  ({ one }) => ({
    restaurant: one(restaurantTable, {
      fields: [restaurantTypeMap.res_id],
      references: [restaurantTable.id],
    }),
    restaurantType: one(restaurantTypeTable, {
      fields: [restaurantTypeMap.type_id],
      references: [restaurantTypeTable.id],
    }),
  }),
);

// Type Inference =============================

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertDietProfile = typeof dietProfileTable.$inferInsert;
export type SelectDietProfile = typeof dietProfileTable.$inferSelect;

export type InsertRestaurant = typeof restaurantTable.$inferInsert;
export type SelectRestaurant = typeof restaurantTable.$inferSelect;

export type InsertRestaurantType = typeof restaurantTypeTable.$inferInsert;
export type SelectRestaurantType = typeof restaurantTypeTable.$inferSelect;

export type InsertDishTable = typeof dishTable.$inferInsert;
export type SelectDishTable = typeof dishTable.$inferSelect;

export type InsertRestaurantTypeMap = typeof restaurantTypeMap.$inferInsert;
export type SelectRestaurantTypeMap = typeof restaurantTypeMap.$inferSelect;

export type InsertComponent = typeof componentTable.$inferInsert;
export type SelectComponent = typeof componentTable.$inferSelect;

export type InsertMealHistory = typeof mealHistoryTable.$inferInsert;
export type SelectMealHistory = typeof mealHistoryTable.$inferSelect;

export type InsertDishComponentMap = typeof dishComponentMap.$inferInsert;
export type SelectDishComponentMap = typeof dishComponentMap.$inferSelect;
