import { stackServerApp } from "@/lib/stack";
import { json } from "@/lib/serverUtils";
import { tryToCastVote } from "@/lib/database";

export async function POST(req: Request) {
    const user = await stackServerApp.getUser();
    if (!user) {
        // User is not logged in
        return json(null, 401);
    }

    const body = await req.json();
    if (
        typeof body !== 'object' ||
        body === null ||
        typeof body.drinkId !== 'string' ||
        typeof body.snackId !== 'string' ||
        typeof body.mainId !== 'string'
    ) {
        return json(null, 400);
    }

    const { drinkId, snackId, mainId } = body;

    const { newLastVoted, success } = await tryToCastVote(user.id, drinkId, snackId, mainId);
    return json(newLastVoted.toISOString(), success ? 200 : 400);
}
