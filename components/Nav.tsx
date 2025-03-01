"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLastVoted } from "@/lib/state";

function CastVoteButton() {
    const lastVoted = useLastVoted();

    if (lastVoted === undefined) {
        // Page is still loading
        return null;
    }

    if (lastVoted === null) {
        // User is not logged in - show a login button to the right
        return (
            <Link href="/handler/sign-in" className="ml-4">
                Login
            </Link>
        );
    }
}

export default function Nav() {
    const pathname = usePathname();

    return (
        <nav className="m-4">
            <Link href="/">
                meal deal showdown
            </Link>

            <Link href="/" className={`ml-4 ${pathname === "/" ? "underline font-bold" : ""}`}>
                Meal Deal Leaderboard
            </Link>
            <Link href="/drinks" className={`ml-4 ${pathname === "/drinks" ? "underline font-bold" : ""}`}>
                Drinks Leaderboard
            </Link>
            <Link href="/snacks" className={`ml-4 ${pathname === "/snacks" ? "underline font-bold" : ""}`}>
                Snacks Leaderboard
            </Link>
            <Link href="/mains" className={`ml-4 ${pathname === "/mains" ? "underline font-bold" : ""}`}>
                Mains Leaderboard
            </Link>

            <div aria-live="polite" aria-atomic="true">
                <CastVoteButton />
            </div>
        </nav>
    );
}
