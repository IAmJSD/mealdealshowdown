export function json(value: unknown, status: number) {
    return new Response(JSON.stringify(value), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
