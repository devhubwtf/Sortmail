import type { Metadata } from "next";
import { DM_Serif_Display, Outfit, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";

const dmSerif = DM_Serif_Display({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ["400", "500", "600"],
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "SortMail — AI Email Intelligence for Gmail & Outlook",
    description:
        "AI-powered intelligence layer that summarizes threads, extracts tasks, and drafts replies. Your inbox, finally under control.",
    keywords: ["email", "AI", "Gmail", "Outlook", "productivity", "task management"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${dmSerif.variable} ${outfit.variable} ${ibmPlexMono.variable}`}
        >
            <body className="font-body antialiased">{children}</body>
        </html>
    );
}
