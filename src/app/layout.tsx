import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import Header from "@/widgets/header/ui/header";
import { Footer } from "@/widgets/ui/footer";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GutVault",
  description:
    "A privacy-first, offline-ready IBS tracker featuring AI voice logging and local-first architecture. Built with Next.js 15, FastAPI, and Dexie.js",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "GutVault",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased min-h-screen `}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
