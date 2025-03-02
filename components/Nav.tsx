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
            <Link href="/handler/sign-in" className="mx-2">
                Login
            </Link>
        );
    }

    if ((Date.now() - lastVoted.getTime()) > 1000 * 60 * 60 * 24) {
        return (
            <Link href="/vote" className="mx-2">
                Cast Vote
            </Link>
        );
    }

    return (
        <span className="italic mx-2">You can vote again soon!</span>
    )
}

export default function Nav() {
    const pathname = usePathname();

    return (
        <nav className="m-4 flex items-center justify-between">
            <div className="flex items-center">
                <Link href="/">
                    meal deal showdown
                </Link>

                <Link href="/" className={`ml-4 ${pathname === "/" ? "font-bold" : ""}`}>
                    Meal Deals
                </Link>
                <Link href="/drinks" className={`ml-4 ${pathname === "/drinks" ? "font-bold" : ""}`}>
                    Drinks
                </Link>
                <Link href="/snacks" className={`ml-4 ${pathname === "/snacks" ? "font-bold" : ""}`}>
                    Snacks
                </Link>
                <Link href="/mains" className={`ml-4 ${pathname === "/mains" ? "font-bold" : ""}`}>
                    Mains
                </Link>
            </div>

            <span aria-live="polite" aria-atomic="true">
                <CastVoteButton />
            </span>
        </nav>
    );
}
