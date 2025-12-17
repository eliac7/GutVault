import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GutVault",
  description:
    "A privacy-first, offline-ready IBS tracker featuring AI voice logging and local-first architecture. Built with Next.js 15, FastAPI, and Dexie.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>{children}</body>
    </html>
  );
}
