import type { Metadata } from "next";
import { Jua, Margarine } from "next/font/google";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

const margarine = Margarine({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-margarine",
  display: "swap",
});

export const metadata: Metadata = {
  title: "personal website",
  description: "estella gu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jua.variable} ${margarine.variable} font-jua antialiased`}>
        {children}
      </body>
    </html>
  );
}
