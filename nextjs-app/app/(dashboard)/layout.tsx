'use client'

import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import dynamic from 'next/dynamic'

const DolphinMascot = dynamic(
  () => import('@/components/mascot/DolphinMascot').then(mod => ({ default: mod.DolphinMascot })),
  { ssr: false }
)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main content area - shifted right on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto p-4 sm:p-8 pb-24 lg:pb-8 max-w-7xl">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Dolphin Mascot - Adjusted position if needed, or kept as fixed */}
      <DolphinMascot />
    </div>
  )
}
