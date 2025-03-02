import MainContainer from "@/components/MainContainer";
import React from "react";
import Loading from "@/components/Loading";
import { getTopSnacks } from "@/lib/database";
import ItemSpecificView from "@/components/ItemSpecificView";

export const dynamic = "force-dynamic";

async function SnacksLeaderboard() {
    async function getTop() {
        "use server";

        return await getTopSnacks();
    }

    return (
        <ItemSpecificView initBody={await getTop()} getTopOfTheType={getTop} />
    );
}

export default function Snacks() {
    return (
        <MainContainer>
            <h1 className="text-2xl font-bold">Snacks Leaderboard</h1>
            <h2 className="text-lg my-4">
                All the snacks that were voted for in amongst different meal
                deals. See where yours ranks!
            </h2>
            <div aria-live="polite" aria-atomic="true">
                <React.Suspense fallback={<Loading />}>
                    <SnacksLeaderboard />
                </React.Suspense>
            </div>
        </MainContainer>
    );
}
