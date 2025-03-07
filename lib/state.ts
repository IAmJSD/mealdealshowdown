import { atom } from "atomtree";

const lastVotedAtom = atom<Date | null | undefined>(undefined);

// On the client, query the last voted date from the server
if (typeof window !== "undefined") {
    fetch("/api/last-voted").then(async (res) => {
        const lastVoted: string | null = await res.json();
        lastVotedAtom.set(lastVoted ? new Date(lastVoted) : null);
    });
}

/** Use the last voted date */
export function useLastVoted() {
    return lastVotedAtom.use();
}

/** Defines callbacks for when an update is needed. */
export const updateCallbacks: Set<() => void> = new Set();

/** Cast a vote for a meal deal. */
export async function castVote(
    drinkId: string,
    snackId: string,
    mainId: string,
) {
    const res = await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({ drinkId, snackId, mainId }),
    });

    const j: string | null = await res.json();
    lastVotedAtom.set(j ? new Date(j) : null);

    updateCallbacks.forEach((cb) => cb());

    if (!res.ok) {
        throw new Error("Failed to cast vote");
    }
}
