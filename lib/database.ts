import "server-only";

import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });

const topMealDealsQuery = `
SELECT drink_id, snack_id, main_id,
    drink.name AS drink_name, drink.image AS drink_image,
    snack.name AS snack_name, snack.image AS snack_image,
    main.name AS main_name, main.image AS main_image,
    vote_count
FROM meal_deal_votes
JOIN meal_deal_items AS drink ON drink_id = drink.id
JOIN meal_deal_items AS snack ON snack_id = snack.id
JOIN meal_deal_items AS main ON main_id = main.id
ORDER BY vote_count DESC
LIMIT 20
`;

export async function getTopMealDeals() {
    const result = await pool.query(topMealDealsQuery);
    return result.rows as {
        drink_id: string;
        snack_id: string;
        main_id: string;
        drink_name: string;
        drink_image: string;
        snack_name: string;
        snack_image: string;
        main_name: string;
        main_image: string;
        vote_count: number;
    }[];
}

const topDrinksQuery = `
SELECT id, vote_count, item.name, item.image
FROM meal_deal_drink_votes
JOIN meal_deal_items AS item ON id = item.id
ORDER BY vote_count DESC
LIMIT 20
`;


export async function getTopDrinks() {
    const result = await pool.query(topDrinksQuery);
    return result.rows as {
        id: string;
        name: string;
        image: string;
        vote_count: number;
    }[];
}

const topSnacksQuery = `
SELECT id, vote_count, item.name, item.image
FROM meal_deal_snack_votes
JOIN meal_deal_items AS item ON id = item.id
ORDER BY vote_count DESC
LIMIT 20
`;

export async function getTopSnacks() {
    const result = await pool.query(topSnacksQuery);
    return result.rows as {
        id: string;
        name: string;
        image: string;
        vote_count: number;
    }[];
}

const topMainsQuery = `
SELECT id, vote_count, item.name, item.image
FROM meal_deal_main_votes
JOIN meal_deal_items AS item ON id = item.id
ORDER BY vote_count DESC
LIMIT 20
`;

export async function getTopMains() {
    const result = await pool.query(topMainsQuery);
    return result.rows as {
        id: string;
        name: string;
        image: string;
        vote_count: number;
    }[];
}

const lastVotedQuery = `
SELECT last_voted
FROM user_votes
WHERE user_id = $1
`;

export async function getLastVoted(userId: string) {
    const result = await pool.query(lastVotedQuery, [userId]);
    return (result.rows[0]?.last_voted as Date | undefined) ?? null;
}
