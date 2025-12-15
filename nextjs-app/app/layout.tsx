import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MascotProvider } from "@/components/mascot/MascotProvider";
import { defaultMetadata } from "@/lib/metadata";
import OceanBackground from "@/components/gamification/OceanBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  preload: true, // Preload font for better performance
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

// Use enhanced metadata with SEO optimizations
export const metadata = {
  ...defaultMetadata,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MisosCare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        {/* Đại dương của Miso - Background layer */}
        <OceanBackground />

        {/* Nội dung chính - Positioned above ocean */}
        <div className="relative z-0 min-h-screen">
          {children}
        </div>

        <MascotProvider />
      </body>
    </html>
  );
}
