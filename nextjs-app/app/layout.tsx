import type { Viewport } from "next";
import "./globals.css";
import { MascotProvider } from "@/components/mascot/MascotProvider";
import { defaultMetadata } from "@/lib/metadata";
import RippleCursor from "@/components/effects/RippleCursor";

// Fonts loaded via CDN in <head> to avoid build-time fetch issues
// This allows the app to build without network access to Google Fonts

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
      <head>
        {/* Load Google Fonts via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans text-slate-800 dark:text-slate-100">
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
