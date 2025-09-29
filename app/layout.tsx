import "./globals.css";
import localFont from "next/font/local";

const openSans = localFont({
  src: '../public/fonts/OpenSans/OpenSans.ttf',
  variable: '--font-opensans',
})

const raleway = localFont({
  src: '../public/fonts/Raleway/Raleway.ttf',
  variable: '--font-raleway',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${raleway.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
