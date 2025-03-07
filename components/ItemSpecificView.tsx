"use client";

import type { getTopSnacks } from "@/lib/database";
import { updateCallbacks } from "@/lib/state";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
    initBody: Awaited<ReturnType<typeof getTopSnacks>>;
    getTopOfTheType: typeof getTopSnacks;
};

export default function ItemSpecificView({ initBody, getTopOfTheType }: Props) {
    const [body, setBody] = useState(initBody);

    useEffect(() => {
        let active = true;
        const hn = () =>
            getTopOfTheType().then((body) => {
                if (active) {
                    setBody(body);
                }
            });
        const interval = setInterval(hn, 60000);
        updateCallbacks.add(hn);
        return () => {
            active = false;
            updateCallbacks.delete(hn);
            clearInterval(interval);
        };
    }, [getTopOfTheType]);

    return (
        <ul className="list-none">
            {body.map((item) => (
                <li key={item.id} className="border-t border-gray-200 py-4">
                    <div className="flex gap-8">
                        <Image
                            src={item.image}
                            alt=""
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                        <div className="flex-col">
                            <p className="text-2xl">{item.name}</p>
                            <p className="mt-2">
                                {item.vote_count} vote
                                {item.vote_count === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
