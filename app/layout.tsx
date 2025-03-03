import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
    title: "Meal Deal Showdown",
    description: "The survival of the fittest meal deal. May the best win!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="https://astrid.place/favicon.png" />
            </head>
            <body className="dark:bg-black dark:text-white">
                <Nav />
                {children}
            </body>
        </html>
    );
}
