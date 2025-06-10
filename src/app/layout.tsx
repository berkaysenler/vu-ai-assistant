// Icon Implementation Guide for Victoria University Assistant

// 1. FAVICON (Tab Icon) Setup
// Place your favicon files in the /public directory:

// File structure needed in /public:
// /public/favicon.ico (16x16, 32x32, 48x48 sizes in one file)
// /public/favicon-16x16.png
// /public/favicon-32x32.png
// /public/apple-touch-icon.png (180x180)
// /public/icon-192.png (192x192)
// /public/icon-512.png (512x512)

// 2. Update app/layout.tsx to include favicon metadata:

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/theme-context";
import { UserProvider } from "@/lib/context/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VU Assistant - Victoria University AI Helper",
  description:
    "Your AI-powered Victoria University guide for courses, enrollment, campus info and more",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/vu-icon.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: {
      url: "/vu-logo.png",
      sizes: "180x180",
      type: "image/png",
    },
    other: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json", // Optional: for PWA support
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
