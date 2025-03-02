"use client";

import Image from "next/image";

type Props = {
    image: string;
    name: string;
};

export default function Item({ image, name }: Props) {
    return (
        <div className="flex items-center gap-2">
            <Image
                src={image}
                alt={name}
                width={30}
                height={30}
                className="rounded-full"
            />
            <p aria-hidden="true">{name}</p>
        </div>
    );
}
