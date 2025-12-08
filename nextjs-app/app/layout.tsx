import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MascotProvider } from "@/components/mascot/MascotProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Misos Care - Mental Health & Personality Tests",
  description: "Ứng dụng sàng lọc sức khỏe tinh thần và trắc nghiệm tính cách",
  // manifest: "/manifest.json", // Disabled until icons are created
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Miso's Care",
  },
  formatDetection: {
    telephone: false,
  },
  // icons: {
  //   icon: "/icon-192x192.png",
  //   apple: "/icon-192x192.png",
  // },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
        {children}
        <MascotProvider />
      </body>
    </html>
  );
}
