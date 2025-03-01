import "server-only";

import { Pool, PoolClient } from "@neondatabase/serverless";

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

export async function getLastVoted(userId: string, tx?: PoolClient) {
    const result = await (tx ?? pool).query(lastVotedQuery, [userId]);
    return (result.rows[0]?.last_voted as Date | undefined) ?? null;
}

export async function tryToCastVote(
    userId: string, drinkId: string, snackId: string, mainId: string,
): Promise<{
    newLastVoted: Date;
    success: boolean;
}> {
    // Start a transaction
    const tx = await pool.connect();
    await tx.query('BEGIN');
    let lastVoted: Date | null = null;
    try {
        // Check the users voting eligibility
        lastVoted = await getLastVoted(userId, tx);
        if (lastVoted && lastVoted.getTime() > Date.now() - 1000 * 60 * 60 * 24) {
            // User has voted too recently
            return {
                newLastVoted: lastVoted,
                success: false,
            }
        }

        // Check all the items exist and are from the same store.
        const itemsExist = await tx.query(
            "SELECT check_food_items_are_from_same_store_and_type_and_exist($1, $2, $3)",
            [drinkId, snackId, mainId]
        );
        if (!itemsExist.rows[0].check_food_items_are_from_same_store_and_type_and_exist) {
            return {
                newLastVoted: lastVoted ?? new Date(0),
                success: false,
            }
        }

        // Cast the vote
        await tx.query(
            "INSERT INTO meal_deal_votes (drink_id, snack_id, main_id) VALUES ($1, $2, $3) ON CONFLICT (drink_id, snack_id, main_id) DO UPDATE SET vote_count = meal_deal_votes.vote_count + 1",
            [drinkId, snackId, mainId]
        );
        const result = await tx.query(
            "INSERT INTO user_votes (user_id, last_voted) VALUES ($1, NOW()) ON CONFLICT (user_id) DO UPDATE SET last_voted = NOW() RETURNING last_voted",
            [userId],
        );
        await tx.query('COMMIT');
        return {
            newLastVoted: new Date(result.rows[0].last_voted),
            success: true,
        }
    } catch {
        await tx.query('ROLLBACK');
        return {
            newLastVoted: lastVoted ?? new Date(0),
            success: false,
        }
    } finally {
        tx.release();
    }
}
