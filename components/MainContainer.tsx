"use client";

export default function MainContainer({ children }: { children: React.ReactNode }) {
    return (
        <main className="max-w-4xl mx-auto mt-16">
            {children}
        </main>
    );
}
