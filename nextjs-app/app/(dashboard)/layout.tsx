/**
 * Dashboard Layout
 * Protected layout for authenticated users
 */

'use client'

import dynamic from 'next/dynamic'
import { Navbar } from '@/components/layout/Navbar'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)]">
        {children}
      </div>
      <DolphinMascot />
    </div>
  )
}
