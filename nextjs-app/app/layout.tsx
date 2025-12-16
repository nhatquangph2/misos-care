import type { Viewport } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import { MascotProvider } from "@/components/mascot/MascotProvider";
import { defaultMetadata } from "@/lib/metadata";
import EnvironmentBackground from "@/components/gamification/EnvironmentBackground";
import RippleCursor from "@/components/effects/RippleCursor";
import type { EnvironmentType } from "@/lib/gamification-config";

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
  // TODO: Sau này cần fetch MBTI từ Supabase/Profile sau khi người dùng đăng nhập
  // và sử dụng Context API hoặc Server Component để lấy MBTI động
  // Tạm thời hardcode để demo, có thể thay đổi thành 'ocean', 'forest', 'sky', hoặc 'cosmos'
  const initialEnvType: EnvironmentType = 'ocean'
  const initialLevel: number = 0 // Level 0 = sáng nhất

  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${quicksand.variable} antialiased font-sans text-slate-800 dark:text-slate-100`}
      >
        {/* HỆ THỐNG MÔI TRƯỜNG ĐA DẠNG - Environment system based on MBTI */}
        <EnvironmentBackground type={initialEnvType} level={initialLevel} />

        {/* Con trỏ gợn sóng - Ripple cursor effect */}
        <RippleCursor />

        {/* Nội dung chính - Positioned above environment */}
        <div className="relative z-0 min-h-screen pb-24">
          {children}
        </div>

        <MascotProvider />
      </body>
    </html>
  );
}
