/**
 * PDF Export Service
 * Generate PDF reports for test results
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { BFI2Score } from '@/constants/tests/bfi2-questions'
import { BFI2_DOMAINS } from '@/constants/tests/bfi2-questions'

export interface ExportPDFOptions {
  score: BFI2Score
  userName?: string
  completedAt?: Date
  includeCharts?: boolean
}

/**
 * Export BFI-2 results to PDF
 */
export async function exportBFI2ToPDF(options: ExportPDFOptions): Promise<void> {
  const { score, userName, completedAt } = options

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let currentY = margin

  // Helper function to add text
  const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color: string = '#000000') => {
    pdf.setFontSize(size)
    pdf.setFont('helvetica', style)
    const rgb = hexToRgb(color)
    pdf.setTextColor(rgb.r, rgb.g, rgb.b)
    pdf.text(text, margin, currentY)
    currentY += size * 0.5
  }

  // Helper function to check if we need new page
  const checkPageBreak = (spaceNeeded: number) => {
    if (currentY + spaceNeeded > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
      return true
    }
    return false
  }

  // Title
  addText('BÁO CÁO PHÂN TÍCH TÍNH CÁCH BFI-2', 20, 'bold', '#4F46E5')
  currentY += 5
  addText('Big Five Inventory-2: Đánh giá 5 đặc điểm tính cách', 12, 'normal', '#6B7280')
  currentY += 10

  // User Info
  if (userName) {
    addText(`Họ và tên: ${userName}`, 11, 'normal')
  }
  if (completedAt) {
    addText(`Ngày làm test: ${completedAt.toLocaleDateString('vi-VN')}`, 11, 'normal')
  }
  currentY += 10

  // Separator
  pdf.setDrawColor(229, 231, 235)
  pdf.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 10

  // 5 Domains Overview
  addText('5 ĐẶC ĐIỂM TÍNH CÁCH CHÍNH', 14, 'bold', '#4F46E5')
  currentY += 5

  for (const domain of BFI2_DOMAINS) {
    checkPageBreak(30)

    const domainScore = score.domains[domain.code]
    const tScore = score.tScores.domains[domain.code]
    const percentile = score.percentiles.domains[domain.code]

    // Domain name
    addText(`${domain.name} (${domain.nameEn})`, 12, 'bold', '#1F2937')
    currentY += 3

    // Score
    pdf.setFontSize(10)
    pdf.setTextColor(75, 85, 99)
    pdf.text(`Điểm: ${domainScore.toFixed(2)}/5.0  |  T-Score: ${Math.round(tScore)}  |  Phân vị: ${percentile}`, margin, currentY)
    currentY += 5

    // Description
    pdf.setFontSize(9)
    pdf.setTextColor(107, 114, 128)
    const lines = pdf.splitTextToSize(domain.description, pageWidth - 2 * margin)
    pdf.text(lines, margin, currentY)
    currentY += lines.length * 4

    // Progress bar
    const barWidth = pageWidth - 2 * margin
    const barHeight = 8
    const fillWidth = (domainScore / 5) * barWidth

    // Background
    pdf.setFillColor(229, 231, 235)
    pdf.rect(margin, currentY, barWidth, barHeight, 'F')

    // Fill based on score
    if (domain.code === 'N') {
      // Neuroticism: red gradient
      pdf.setFillColor(239, 68, 68)
    } else {
      // Other domains: purple gradient
      pdf.setFillColor(139, 92, 246)
    }
    pdf.rect(margin, currentY, fillWidth, barHeight, 'F')

    currentY += barHeight + 10
  }

  // Footer
  checkPageBreak(30)
  currentY = pageHeight - margin - 20
  pdf.setDrawColor(229, 231, 235)
  pdf.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 5

  pdf.setFontSize(8)
  pdf.setTextColor(107, 114, 128)
  pdf.text('Kết quả này chỉ mang tính tham khảo. Tính cách có thể thay đổi theo thời gian.', margin, currentY)
  currentY += 4
  pdf.text('Tạo bởi Miso\'s Care - https://misos-care.vercel.app', margin, currentY)

  // Generate filename
  const date = completedAt ? completedAt.toISOString().split('T')[0] : 'latest'
  const filename = `BFI2_Report_${date}.pdf`

  // Save PDF
  pdf.save(filename)
}

/**
 * Share results as image
 * Captures the results page and converts to shareable image
 */
export async function shareResultsAsImage(elementId: string): Promise<Blob | null> {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found:', elementId)
    return null
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    })

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png')
    })
  } catch (error) {
    console.error('Error creating image:', error)
    return null
  }
}

/**
 * Generate shareable link for results
 */
export function generateShareableLink(score: BFI2Score): string {
  // Encode basic scores only (to keep URL short)
  const params = new URLSearchParams({
    e: score.domains.E.toFixed(2),
    a: score.domains.A.toFixed(2),
    c: score.domains.C.toFixed(2),
    n: score.domains.N.toFixed(2),
    o: score.domains.O.toFixed(2),
  })

  return `${window.location.origin}/tests/big5/shared?${params.toString()}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}
