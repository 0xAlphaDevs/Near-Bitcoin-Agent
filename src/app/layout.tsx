import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bitcoin Agent",
  description:
    "An AI agent that uses NEAR chain signatures to interact with Bitcoin L1.",
  metadataBase: new URL("https://www.bitcoin-agent.xyz/"),
  openGraph: {
    title: "Bitcoin Agent",
    description:
      "An AI agent that uses NEAR chain signatures to interact with Bitcoin L1.",
    url: "https://www.bitcoin-agent.xyz/",
    siteName: "Bitcoin Agent",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bitcoin Agent",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Agent",
    description:
      "An AI agent that uses NEAR chain signatures to interact with Bitcoin L1.",
    site: "@btc_near",
    creator: "@btc_near",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // 180x180
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
