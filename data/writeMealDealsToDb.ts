import { sql } from "bun";

import * as tesco from "./json/tesco.json";
import * as asda from "./json/asda.json";
import * as coop from "./json/coop.json";
import type { MealDealData, MealDealItem } from "./dataStructure";

const mealDealIds = new Set(
    ((await sql`SELECT id FROM meal_deal_items`) as { id: string }[]).map(
        (x) => x.id,
    ),
);

const datasets = { tesco, asda, coop };

async function loadMealDeals(store: string, data: MealDealData) {
    const insertItem = async (
        item: MealDealItem,
        type: "main" | "snack" | "drink",
    ) => {
        await sql`INSERT INTO meal_deal_items (id, shop, type, name, image) VALUES (${item.id}, ${store}, ${type}, ${item.name}, ${item.image}) ON CONFLICT (id) DO UPDATE SET in_stock = TRUE`;
        mealDealIds.delete(item.id);
    };
    for (const m of data.mains) insertItem(m, "main");
    for (const s of data.snacks) insertItem(s, "snack");
    for (const d of data.drinks) insertItem(d, "drink");
}

for (const [store, data] of Object.entries(datasets)) {
    await loadMealDeals(store, data);
}

await sql`UPDATE meal_deal_items SET in_stock = FALSE WHERE id IN (${Array.from(mealDealIds)})`;

console.log(`Done! - ${mealDealIds.size} meal deals marked as out of stock`);
