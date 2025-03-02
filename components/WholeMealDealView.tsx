"use client";

import type { getTopMealDeals } from "@/lib/database";
import { useState, useEffect } from "react";
import { updateCallbacks } from "@/lib/state";
import Item from "./Item";
import InlineVoteCaster from "./InlineVoteCaster";

type Props = {
    initBody: Awaited<ReturnType<typeof getTopMealDeals>>;
    getTopMealDeals: typeof getTopMealDeals;
}

export default function WholeMealDealView({ initBody, getTopMealDeals }: Props) {
    const [body, setBody] = useState(initBody);

    useEffect(() => {
        let active = true;
        const hn = () => getTopMealDeals().then((body) => {
            if (active) {
                setBody(body);
            }
        });
        const interval = setInterval(hn, 60000);
        updateCallbacks.add(hn);
        return () => {
            updateCallbacks.delete(hn);
            clearInterval(interval);
            active = false;
        };
    }, [getTopMealDeals]);

  return (
    <ul className="list-none">
      {body.map((mealDeal) => (
        <li
          key={`${mealDeal.drink_id}-${mealDeal.snack_id}-${mealDeal.main_id}`}
          className="border-t border-gray-200 py-4"
        >
          <div className="flex gap-4">
            <Item image={mealDeal.drink_image} name={mealDeal.drink_name} />
            <span>+</span>
            <Item image={mealDeal.snack_image} name={mealDeal.snack_name} />
            <span>+</span>
            <Item image={mealDeal.main_image} name={mealDeal.main_name} />
          </div>
          <p className="mt-4 text-2xl">
            <span className="font-bold">{mealDeal.vote_count} vote{mealDeal.vote_count === 1 ? "" : "s"}</span>
            <InlineVoteCaster drinkId={mealDeal.drink_id} snackId={mealDeal.snack_id} mainId={mealDeal.main_id} />
          </p>
        </li>
      ))}
    </ul>
  );
}
