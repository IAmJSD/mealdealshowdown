import MainContainer from "@/components/MainContainer";
import React from "react";
import Loading from "@/components/Loading";
import { getTopDrinks } from "@/lib/database";
import ItemSpecificView from "@/components/ItemSpecificView";

export const runtime = "edge";

async function DrinksLeaderboard() {
    async function getTop() {
        "use server";

        return await getTopDrinks();
    }

    return (
        <ItemSpecificView initBody={await getTop()} getTopOfTheType={getTop} />
    );
}

export default function Drinks() {
    return (
        <MainContainer>
            <h1 className="text-2xl font-bold">Drinks Leaderboard</h1>
            <h2 className="text-lg my-4">
                All the drinks that were voted for in amongst different meal
                deals. See where yours ranks!
            </h2>
            <div aria-live="polite" aria-atomic="true">
                <React.Suspense fallback={<Loading />}>
                    <DrinksLeaderboard />
                </React.Suspense>
            </div>
        </MainContainer>
    );
}
