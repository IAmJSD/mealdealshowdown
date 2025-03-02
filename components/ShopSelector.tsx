"use client";

import Image from "next/image";

type Props = {
    keys: string[];
    onSelect: (shop: string) => void;
};

export default function ShopSelector({ keys, onSelect }: Props) {
    return (
        <>
            <h1 className="text-center text-2xl">Select a shop</h1>
            <p className="text-center my-4">
                Select the shop your meal deal is from:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                {keys.map((key) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className="dark:bg-gray-800 bg-gray-100 rounded-md p-2 cursor-pointer"
                    >
                        <Image
                            src={`/${key}.png`}
                            alt={key}
                            width={100}
                            className="max-h-12 object-contain"
                            height={20}
                        />
                    </button>
                ))}
            </div>
        </>
    );
}
