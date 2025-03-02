"use client";

import { useLastVoted } from "@/lib/state";
import Link from "next/link";

export default function LinkCTA() {
    const lastVoted = useLastVoted();

    if (lastVoted === undefined) return null;

    if (lastVoted === null) {
        return (
            <Link href="/handler/sign-in" className="underline">
                Sign in to vote for it!
            </Link>
        );
    }

    return (
        <Link href="/vote" className="underline">
            Vote for it here!
        </Link>
    );
}
