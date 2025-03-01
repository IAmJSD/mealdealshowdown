"use client";

import { useLastVoted, castVote } from "@/lib/state";
import Link from "next/link";

type Props = {
    drinkId: string;
    snackId: string;
    mainId: string;
};

export default function InlineVoteCaster({ drinkId, snackId, mainId }: Props) {
    async function tryToCastVote() {
        try {
            await castVote(drinkId, snackId, mainId);
        } catch (e) {
            console.error(e);
        }
    }

    const lastVoted = useLastVoted();
    if (lastVoted === undefined) {
        return <></>;
    }

    if (lastVoted === null) {
        return (
            <>
                : <Link href="/handler/sign-in" className="italic">You must be logged in to vote</Link>
            </>
        );
    }

    if ((Date.now() - lastVoted.getTime()) > 1000 * 60 * 60 * 24) {
        return (
            <>
                : <button className="underline cursor-pointer" onClick={() => tryToCastVote(drinkId, snackId, mainId)}>Cast Vote</button>
            </>
        );
    }

    return (
        <>
            : <span className="italic">You can't vote again until tomorrow</span>
        </>
    )
}
