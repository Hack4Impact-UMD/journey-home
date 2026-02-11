"use client";

import "./globals.css";
import localFont from "next/font/local";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Providers } from "./providers";

const openSans = localFont({
    src: "../public/fonts/OpenSans/OpenSans.ttf",
    variable: "--font-opensans",
});

const raleway = localFont({
    src: "../public/fonts/Raleway/Raleway.ttf",
    variable: "--font-raleway",
});

const roboto = localFont({
    src: "../public/fonts/Roboto/Roboto.ttf",
    variable: "--font-roboto",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <html
                lang="en"
                className={`${openSans.variable} ${raleway.variable} ${roboto.variable} w-full h-full overscroll-none`}
            >
                <body className="w-full h-full font-family-roboto">
                    <Toaster />
                    {children}
                </body>
            </html>
        </Providers>
    );
}
