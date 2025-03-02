"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLastVoted } from "@/lib/state";
import { useState } from "react";

function CastVoteButton() {
    const lastVoted = useLastVoted();

    if (lastVoted === undefined) {
        // Page is still loading
        return null;
    }

    if (lastVoted === null) {
        // User is not logged in - show a login button to the right
        return (
            <Link href="/handler/sign-in" className="lg:mx-2">
                Login
            </Link>
        );
    }

    if (Date.now() - lastVoted.getTime() > 1000 * 60 * 60 * 24) {
        return (
            <Link href="/vote" className="lg:mx-2">
                Cast Vote
            </Link>
        );
    }

    return <span className="italic lg:mx-2">You can vote again soon!</span>;
}

export default function Nav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="m-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-semibold">
                        meal deal showdown
                    </Link>

                    <div className="hidden lg:flex lg:items-center">
                        <Link
                            href="/"
                            className={`ml-4 ${pathname === "/" ? "font-bold" : ""}`}
                        >
                            Meal Deals
                        </Link>
                        <Link
                            href="/drinks"
                            className={`ml-4 ${pathname === "/drinks" ? "font-bold" : ""}`}
                        >
                            Drinks
                        </Link>
                        <Link
                            href="/snacks"
                            className={`ml-4 ${pathname === "/snacks" ? "font-bold" : ""}`}
                        >
                            Snacks
                        </Link>
                        <Link
                            href="/mains"
                            className={`ml-4 ${pathname === "/mains" ? "font-bold" : ""}`}
                        >
                            Mains
                        </Link>
                    </div>
                </div>

                <div className="flex items-center">
                    <span
                        aria-live="polite"
                        aria-atomic="true"
                        className="hidden lg:inline-block"
                    >
                        <CastVoteButton />
                    </span>

                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isMenuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`${isMenuOpen ? "block" : "hidden"} lg:hidden mt-4`}
            >
                <div className="flex flex-col space-y-3">
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className={`block ${pathname === "/" ? "font-bold" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Meal Deals
                        </Link>
                        <Link
                            href="/drinks"
                            className={`block ${pathname === "/drinks" ? "font-bold" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Drinks
                        </Link>
                        <Link
                            href="/snacks"
                            className={`block ${pathname === "/snacks" ? "font-bold" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Snacks
                        </Link>
                        <Link
                            href="/mains"
                            className={`block ${pathname === "/mains" ? "font-bold" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Mains
                        </Link>
                    </div>
                    <div className="py-2">
                        <span aria-live="polite" aria-atomic="true">
                            <CastVoteButton />
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
