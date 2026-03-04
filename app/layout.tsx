"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const openSans = localFont({
    src: "../public/fonts/OpenSans/OpenSans.ttf",
    variable: "--font-opensans",
});

const raleway = localFont({
    src: [
        {
            path: "../public/fonts/Raleway/Raleway-Light.ttf",
            weight: "300",
        },
        {
            path: "../public/fonts/Raleway/Raleway-Regular.ttf",
            weight: "400",
        },
    ],
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
