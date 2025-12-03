import "./globals.css";
import localFont from "next/font/local";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

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
        <AuthProvider>
            <Toaster />
            <html
                lang="en"
                className={`${openSans.variable} ${raleway.variable} ${roboto.variable} w-full h-full overscroll-none`}
            >
                <body className="w-full h-full font-family-roboto">
                    {children}
                </body>
            </html>
        </AuthProvider>
    );
}
