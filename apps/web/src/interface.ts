export type Sex = "Female" | "Male" | "Other";
export type Goal = "Balanced" | "Moderate" | "High Protein" | "Ketogenic";

export interface UpdateUserDto {
    username?: string;
    dob?: Date;
    sex?: Sex;
    weight?: number;
    height?: number;
    activity_level?: number;
    vegetarian_default?: boolean;
    halal_default?: boolean;
    no_lactose_default?: boolean;
    no_peanut_default?: boolean;
    gluten_free_default?: boolean;
    goal?: Goal;
    no_shellfish_default?: boolean;
}

