import MainContainer from "@/components/MainContainer";
import React from "react";
import Loading from "@/components/Loading";
import { getTopMains } from "@/lib/database";
import ItemSpecificView from "@/components/ItemSpecificView";

export const runtime = "edge";

async function MainsLeaderboard() {
  async function getTop() {
    "use server";

    return await getTopMains();
  }

  return <ItemSpecificView initBody={await getTop()} getTopOfTheType={getTop} />;
}

export default function Mains() {
  return (
      <MainContainer>
        <h1 className="text-2xl font-bold">Mains Leaderboard</h1>
        <h2 className="text-lg my-4">
          All the mains that were voted for in amongst different meal deals. See where yours ranks!
        </h2>
        <div aria-live="polite" aria-atomic="true">
          <React.Suspense fallback={<Loading />}>
            <MainsLeaderboard />
          </React.Suspense>
        </div>
      </MainContainer>
  );
}
