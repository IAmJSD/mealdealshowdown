"use client";

import { useLastVoted, castVote } from "@/lib/state";
import Link from "next/link";
import { useCallback } from "react";

type Props = {
    drinkId: string;
    snackId: string;
    mainId: string;
};

export default function InlineVoteCaster({ drinkId, snackId, mainId }: Props) {
    const tryToCastVote = useCallback(async () => {
        try {
            await castVote(drinkId, snackId, mainId);
        } catch (e) {
            console.error(e);
        }
    }, [drinkId, snackId, mainId]);

    const lastVoted = useLastVoted();
    if (lastVoted === undefined) {
        return <></>;
    }

    if (lastVoted === null) {
        return (
            <>
                :{" "}
                <Link href="/handler/sign-in" className="italic">
                    You must be logged in to vote
                </Link>
            </>
        );
    }

    if (Date.now() - lastVoted.getTime() > 1000 * 60 * 60 * 24) {
        return (
            <>
                :{" "}
                <button
                    className="underline cursor-pointer"
                    onClick={() => tryToCastVote()}
                >
                    Cast Vote
                </button>
            </>
        );
    }

    return (
        <>
            :{" "}
            <span className="italic">You can't vote again until tomorrow</span>
        </>
    );
}
