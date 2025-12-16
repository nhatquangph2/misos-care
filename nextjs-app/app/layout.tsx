import type { Viewport } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import { MascotProvider } from "@/components/mascot/MascotProvider";
import { defaultMetadata } from "@/lib/metadata";
import RippleCursor from "@/components/effects/RippleCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
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
        className={`${inter.variable} ${quicksand.variable} antialiased font-sans text-slate-800 dark:text-slate-100`}
      >
        {/* Con trỏ gợn sóng - Ripple cursor effect */}
        <RippleCursor />

        {/* Nội dung chính - Positioned above environment */}
        <div className="relative z-0 min-h-screen pb-24">
          {children}
        </div>

        {/* MascotProvider now handles both Environment Background & Mascot */}
        {/* Background tự động thay đổi theo MBTI của user */}
        <MascotProvider />
      </body>
    </html>
  );
}
