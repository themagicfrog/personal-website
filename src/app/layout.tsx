import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

export const metadata: Metadata = {
  title: "personal website",
  description: "estella gu",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/cat.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${jua.variable} font-jua antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
