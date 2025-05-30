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

// 3. SIDEBAR ICON Update
// Update the dashboard layout sidebar to use VU logo instead of "VU" text

// In dashboard-layout.tsx, replace this section:
/*
<div className={`w-8 h-8 ${themeClasses.primary} rounded-lg flex items-center justify-center shadow-md`}>
  <span className="text-white font-bold text-sm">VU</span>
</div>
*/

// With this:
/*
<div className="w-8 h-8 flex items-center justify-center">
  <img 
    src="/vu-logo-white.png" 
    alt="Victoria University" 
    className="w-8 h-8 object-contain"
  />
</div>
*/

// 4. LOGO FILES YOU'LL NEED:

// For Favicon (Tab Icon):
// - favicon.ico (multi-size: 16x16, 32x32, 48x48)
// - favicon-16x16.png (for modern browsers)
// - favicon-32x32.png (for modern browsers)
// - apple-touch-icon.png (180x180 - for iOS devices)
// - icon-192.png (for Android)
// - icon-512.png (for Android/PWA)

// For Sidebar:
// - vu-logo-white.png (32x32 or 64x64, white version for colored backgrounds)
// - vu-logo-dark.png (32x32 or 64x64, dark version for light backgrounds)

// 5. GETTING THE OFFICIAL VU LOGO:

// Option 1: Download from official sources
// Visit: https://seeklogo.com/vector-logo/310323/victoria-university
// Or: https://www.brandsoftheworld.com/logo/victoria-university

// Option 2: If you have the logo file, place it in /public directory:
// /public/vu-logo-white.png
// /public/vu-logo-dark.png
// /public/favicon.ico
// etc.

// 6. UPDATED SIDEBAR COMPONENT:

// Replace the VU logo section in dashboard-layout.tsx:
