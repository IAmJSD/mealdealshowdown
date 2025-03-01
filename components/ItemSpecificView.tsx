"use client";

import type { getTopSnacks } from "@/lib/database";
import { updateCallbacks } from "@/lib/state";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
    initBody: Awaited<ReturnType<typeof getTopSnacks>>;
    getTopOfTheType: typeof getTopSnacks;
}

export default function ItemSpecificView({ initBody, getTopOfTheType }: Props) {
    const [body, setBody] = useState(initBody);

    useEffect(() => {
        const hn = () => getTopOfTheType().then(setBody);
        const interval = setInterval(hn, 60000);
        updateCallbacks.add(hn);
        return () => {
            updateCallbacks.delete(hn);
            clearInterval(interval);
        };
    }, [getTopOfTheType]);

    return (
        <ul className="list-none">
          {body.map((item) => (
            <li
              key={item.id}
              className="border-t border-gray-200 pt-4"
            >
              <div className="flex gap-4">
                <Image src={item.image} alt="" width={100} height={100} className="rounded-full" />
                <div className="flex-col">
                    <p className="text-2xl">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.vote_count} vote{item.vote_count === 1 ? "" : "s"}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      );
}
