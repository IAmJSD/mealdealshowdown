export type MealDealItem = {
    name: string;
    image: string;
    id: string;
};

export type MealDealData = {
    mains: MealDealItem[];
    snacks: MealDealItem[];
    drinks: MealDealItem[];
};
