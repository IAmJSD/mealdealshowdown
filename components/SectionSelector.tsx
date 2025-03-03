"use client";

import type { MealDealItem } from "@/data/dataStructure";
import Image from "next/image";

type Props = {
    section: MealDealItem[];
    title: string;
    description: string;
    onSelect: (item: MealDealItem) => void;
};

export default function SectionSelector({
    section,
    title,
    description,
    onSelect,
}: Props) {
    return (
        <>
            <h1 className="text-center text-2xl">{title}</h1>
            <p className="text-center my-4">{description}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                {section.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="dark:bg-gray-800 bg-gray-100 rounded-md p-2 cursor-pointer max-w-45"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="mx-auto rounded-md"
                        />
                        <p className="text-center mt-4" aria-hidden="true">
                            {item.name}
                        </p>
                    </button>
                ))}
            </div>
        </>
    );
}
