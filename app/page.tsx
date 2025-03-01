import MainContainer from "@/components/MainContainer";
import React from "react";
import Loading from "@/components/Loading";
import { getTopMealDeals } from "@/lib/database";
import Item from "@/components/Item";

export const runtime = "edge";

async function TopMealDeals() {
  const topMealDeals = await getTopMealDeals();

  return (
    <ul className="list-none">
      {topMealDeals.map((mealDeal) => (
        <li
          key={`${mealDeal.drink_id}-${mealDeal.snack_id}-${mealDeal.main_id}`}
          className="border-t border-gray-200 pt-4"
        >
          <div className="flex gap-4">
            <Item image={mealDeal.drink_image} name={mealDeal.drink_name} />
            <span>+</span>
            <Item image={mealDeal.snack_image} name={mealDeal.snack_name} />
            <span>+</span>
            <Item image={mealDeal.main_image} name={mealDeal.main_name} />
          </div>
          <p className="mt-4 text-2xl">
            {mealDeal.vote_count} vote{mealDeal.vote_count === 1 ? "" : "s"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
      <MainContainer>
        <h1 className="text-2xl font-bold">Meal Deal Leaderboard</h1>
        <h2 className="text-lg my-4">
          The leaderboard of the combinations of different meals. See where yours ranks!
        </h2>
        <div aria-live="polite" aria-atomic="true">
          <React.Suspense fallback={<Loading />}>
            <TopMealDeals />
          </React.Suspense>
        </div>
      </MainContainer>
  );
}
