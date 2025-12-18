import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/shared/providers";

const nunito = Nunito({
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    template: "%s | GutVault",
    default: "GutVault",
  },
  description:
    "A privacy-first, offline-ready IBS tracker featuring AI voice logging and local-first architecture.",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: {
      template: "%s | GutVault",
      default: "GutVault",
    },
    description:
      "A privacy-first, offline-ready IBS tracker featuring AI voice logging and local-first architecture.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | GutVault",
      default: "GutVault",
    },
    description:
      "A privacy-first, offline-ready IBS tracker featuring AI voice logging and local-first architecture.",
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${nunito.className} antialiased min-h-screen `}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
