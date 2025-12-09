/**
 * PDF Export Service
 * Generate PDF reports for test results
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { BFI2Score } from '@/constants/tests/bfi2-questions'

export interface ExportPDFOptions {
  score: BFI2Score
  userName?: string
  completedAt?: Date
  includeCharts?: boolean
}

/**
 * Export BFI-2 results to PDF using html2canvas
 * Captures the results page with proper Vietnamese text support
 */
export async function exportBFI2ToPDF(options: ExportPDFOptions): Promise<void> {
  const { completedAt } = options

  try {
    // Wait for page to render
    await new Promise(resolve => setTimeout(resolve, 200))

    // Find main container
    const container = document.querySelector('.container.max-w-7xl') || document.querySelector('main') || document.body

    // Clone the container to avoid modifying the original
    const clone = container.cloneNode(true) as HTMLElement

    // Remove unwanted elements from clone
    const buttonsToRemove = clone.querySelectorAll('button')
    buttonsToRemove.forEach(btn => {
      const text = btn.textContent || ''
      if (text.includes('Tải PDF') || text.includes('Sao chép') ||
          text.includes('Về trang') || text.includes('Làm lại')) {
        btn.remove()
      }
    })

    // Simplify gradients to solid colors to avoid lab() color issues
    const elementsWithGradient = clone.querySelectorAll('[class*="gradient"]')
    elementsWithGradient.forEach(el => {
      const element = el as HTMLElement
      element.style.background = '#8B5CF6' // Fallback to solid purple
    })

    // Append clone to body temporarily (hidden)
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.top = '0'
    document.body.appendChild(clone)

    // Capture with html2canvas
    const canvas = await html2canvas(clone, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      allowTaint: false,
      foreignObjectRendering: false,
    })

    // Remove clone
    document.body.removeChild(clone)

    // Create PDF
    const imgData = canvas.toDataURL('image/png', 0.95)
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Add pages
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pdfHeight
    }

    // Save
    const date = completedAt ? completedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    const filename = `BFI2_Personality_Report_${date}.pdf`
    pdf.save(filename)

  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error(`Không thể tạo PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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
