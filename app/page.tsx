import MainContainer from "@/components/MainContainer";
import React from "react";
import Loading from "@/components/Loading";
import { getTopMealDeals as getTopMealDealsServer } from "@/lib/database";
import WholeMealDealView from "@/components/WholeMealDealView";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function TopMealDeals() {
    async function getTopMealDeals() {
        "use server";

        return await getTopMealDealsServer();
    }

    return (
        <WholeMealDealView
            initBody={await getTopMealDeals()}
            getTopMealDeals={getTopMealDeals}
        />
    );
}

export default function Home() {
    return (
        <MainContainer>
            <h1 className="text-2xl font-bold">Meal Deal Leaderboard</h1>
            <h2 className="text-lg my-4">
                The leaderboard of the combinations of different meals. See
                where yours ranks!
            </h2>
            <div aria-live="polite" aria-atomic="true">
                <React.Suspense fallback={<Loading />}>
                    <TopMealDeals />
                </React.Suspense>
            </div>
            <p className="mt-8 text-center">
                Don't see your meal deal?{" "}
                <Link href="/vote" className="underline">
                    Vote for it here!
                </Link>
            </p>
        </MainContainer>
    );
}
