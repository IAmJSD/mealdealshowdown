"use client";

import type { MealDealItem } from "@/data/dataStructure";
import Image from "next/image";

type Props = {
    section: MealDealItem[];
    title: string;
    description: string;
    onSelect: (itemId: string) => void;
};

export default function SectionSelector({ section, title, description, onSelect }: Props) {
    return (
        <>
            <h1 className="text-center text-2xl">{title}</h1>
            <p className="text-center my-4">{description}</p>
            
        </>
    );
}
