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
 * Helper function to replace CSS gradients with solid colors
 */
function replaceGradientsWithSolidColors(element: HTMLElement): void {
  // Get computed style
  const style = window.getComputedStyle(element)
  const background = style.background || style.backgroundColor

  // Check if background contains gradient or lab() color
  if (background.includes('gradient') || background.includes('lab(') || background.includes('oklch(')) {
    // Replace with solid color based on element class
    if (element.className.includes('indigo') || element.className.includes('purple')) {
      element.style.background = '#8B5CF6'
    } else if (element.className.includes('blue')) {
      element.style.background = '#3B82F6'
    } else if (element.className.includes('green')) {
      element.style.background = '#22C55E'
    } else if (element.className.includes('red') || element.className.includes('rose')) {
      element.style.background = '#EF4444'
    } else if (element.className.includes('orange') || element.className.includes('amber')) {
      element.style.background = '#F59E0B'
    } else if (element.className.includes('pink')) {
      element.style.background = '#EC4899'
    } else if (element.className.includes('violet')) {
      element.style.background = '#8B5CF6'
    } else {
      element.style.background = '#6366F1' // Default indigo
    }
  }

  // Process children recursively
  Array.from(element.children).forEach(child => {
    replaceGradientsWithSolidColors(child as HTMLElement)
  })
}

/**
 * Export BFI-2 results to PDF using html2canvas
 * Captures the results page with proper Vietnamese text support
 */
export async function exportBFI2ToPDF(options: ExportPDFOptions): Promise<void> {
  const { completedAt } = options

  try {
    // Wait for page to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find main container
    const container = document.querySelector('.container.max-w-7xl') || document.querySelector('main') || document.body

    // Clone the container to avoid modifying the original
    const clone = container.cloneNode(true) as HTMLElement

    // Remove unwanted elements from clone
    const buttonsToRemove = clone.querySelectorAll('button')
    buttonsToRemove.forEach(btn => {
      const text = btn.textContent || ''
      if (text.includes('Tải PDF') || text.includes('Sao chép') ||
          text.includes('Về trang') || text.includes('Làm lại') ||
          text.includes('Đăng nhập')) {
        btn.remove()
      }
    })

    // Remove alerts (save status, login prompts)
    const alertsToRemove = clone.querySelectorAll('[role="alert"]')
    alertsToRemove.forEach(alert => alert.remove())

    // Replace all gradients with solid colors to avoid lab()/oklch() issues
    replaceGradientsWithSolidColors(clone)

    // Also handle inline styles with gradients
    const allElements = clone.querySelectorAll('*')
    allElements.forEach(el => {
      const element = el as HTMLElement
      if (element.style.background?.includes('gradient') ||
          element.style.background?.includes('lab(') ||
          element.style.background?.includes('oklch(')) {
        element.style.background = '#8B5CF6'
      }
      // Fix text gradients (bg-clip-text)
      if (element.style.backgroundClip === 'text' || element.className.includes('bg-clip-text')) {
        element.style.backgroundClip = 'unset'
        element.style.webkitBackgroundClip = 'unset'
        element.style.color = '#6366F1'
        element.style.background = 'none'
      }
    })

    // Set fixed width for consistent rendering
    clone.style.width = '1100px'
    clone.style.maxWidth = '1100px'
    clone.style.padding = '20px'
    clone.style.backgroundColor = '#ffffff'

    // Append clone to body temporarily (hidden)
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.top = '0'
    document.body.appendChild(clone)

    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100))

    // Capture with html2canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      allowTaint: false,
      foreignObjectRendering: false,
      onclone: (clonedDoc) => {
        // Additional cleanup in cloned document
        const clonedElement = clonedDoc.body.querySelector('[style*="left: -9999px"]')
        if (clonedElement) {
          (clonedElement as HTMLElement).style.left = '0'
          ;(clonedElement as HTMLElement).style.position = 'relative'
        }
      }
    })

    // Remove clone
    document.body.removeChild(clone)

    // Create PDF
    const imgData = canvas.toDataURL('image/png', 0.92)
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth - 10 // Add margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 5 // Top margin

    // Add first page
    pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= (pdfHeight - 10)

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 5
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= (pdfHeight - 10)
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
