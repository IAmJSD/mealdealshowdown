import { stackServerApp } from "@/lib/stack";
import { json } from "@/lib/serverUtils";
import { getLastVoted } from "@/lib/database";

export const runtime = "edge";

export async function GET() {
    const user = await stackServerApp.getUser();
    if (!user) {
        return json(null, 200);
    }

    const lastVoted = await getLastVoted(user.id);
    if (!lastVoted) {
        // Return the time in 1970 - user never voted
        return json(new Date(0).toISOString(), 200);
    }

    return json(lastVoted.toISOString(), 200);
}
