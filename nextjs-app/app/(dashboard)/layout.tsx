/**
 * Dashboard Layout
 * Protected layout for authenticated users
 *
 * Updated with FloatingDock navigation - modern iOS/macOS style
 */

'use client'

import dynamicImport from 'next/dynamic'
import FloatingDock from '@/components/layout/FloatingDock'

// Disable static generation for all authenticated dashboard pages
export const dynamic = 'force-dynamic'

const DolphinMascot = dynamicImport(
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
      {/* Removed background gradient - OceanBackground handles it now */}

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-32">
        {children}
      </main>

      {/* Floating Dock Navigation */}
      <FloatingDock />

      {/* Dolphin Mascot */}
      <DolphinMascot />
    </div>
  )
}
