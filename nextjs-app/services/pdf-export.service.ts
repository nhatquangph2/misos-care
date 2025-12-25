/**
 * PDF Export Service
 * Generate PDF reports for test results
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { BFI2Score } from '@/constants/tests/bfi2-questions'
import { BaseService } from './base.service'

export interface ExportPDFOptions {
  score: BFI2Score
  userName?: string
  completedAt?: Date
  includeCharts?: boolean
}

export class PdfExportService extends BaseService {
  /**
   * Replace CSS gradients with solid colors for PDF rendering
   */
  private replaceGradientsWithSolidColors(element: HTMLElement): void {
    if (typeof window === 'undefined') return

    const style = window.getComputedStyle(element)
    const background = style.background || style.backgroundColor

    if (background.includes('gradient') || background.includes('lab(') || background.includes('oklch(')) {
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
        element.style.background = '#6366F1'
      }
    }

    Array.from(element.children).forEach(child => {
      this.replaceGradientsWithSolidColors(child as HTMLElement)
    })
  }

  /**
   * Export BFI-2 results to PDF
   */
  async exportBFI2ToPDF(options: ExportPDFOptions): Promise<void> {
    if (typeof document === 'undefined') return
    const { completedAt } = options

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const container = document.querySelector('.container.max-w-7xl') || document.querySelector('main') || document.body
      const clone = container.cloneNode(true) as HTMLElement

      clone.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent || ''
        if (text.includes('Tải PDF') || text.includes('Sao chép') || text.includes('Về trang') || text.includes('Làm lại') || text.includes('Đăng nhập')) {
          btn.remove()
        }
      })

      clone.querySelectorAll('[role="alert"]').forEach(alert => alert.remove())
      this.replaceGradientsWithSolidColors(clone)

      clone.querySelectorAll('*').forEach(el => {
        const element = el as HTMLElement
        if (element.style.background?.includes('gradient') || element.style.background?.includes('lab(') || element.style.background?.includes('oklch(')) {
          element.style.background = '#8B5CF6'
        }
        if (element.style.backgroundClip === 'text' || element.className.includes('bg-clip-text')) {
          element.style.backgroundClip = 'unset'
          element.style.webkitBackgroundClip = 'unset'
          element.style.color = '#6366F1'
          element.style.background = 'none'
        }
      })

      clone.style.width = '1100px'
      clone.style.maxWidth = '1100px'
      clone.style.padding = '20px'
      clone.style.backgroundColor = '#ffffff'
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      document.body.appendChild(clone)

      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('[style*="left: -9999px"]')
          if (clonedElement) {
            (clonedElement as HTMLElement).style.left = '0'
              ; (clonedElement as HTMLElement).style.position = 'relative'
          }
        }
      })

      document.body.removeChild(clone)

      const imgData = canvas.toDataURL('image/png', 0.92)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth - 10
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 5

      pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= (pdfHeight - 10)

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 5
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= (pdfHeight - 10)
      }

      const date = completedAt ? completedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      pdf.save(`BFI2_Personality_Report_${date}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error(`Không thể tạo PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Share results as image
   */
  async shareResultsAsImage(elementId: string): Promise<Blob | null> {
    if (typeof document === 'undefined') return null
    const element = document.getElementById(elementId)
    if (!element) return null

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', logging: false })
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      })
    } catch (error) {
      console.error('Error creating image:', error)
      return null
    }
  }

  /**
   * Generate shareable link
   */
  generateShareableLink(score: BFI2Score): string {
    if (typeof window === 'undefined') return ''
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
   * Copy to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }
}

export const pdfExportService = new PdfExportService()

export const exportBFI2ToPDF = (o: ExportPDFOptions) => pdfExportService.exportBFI2ToPDF(o)
export const shareResultsAsImage = (id: string) => pdfExportService.shareResultsAsImage(id)
export const generateShareableLink = (s: BFI2Score) => pdfExportService.generateShareableLink(s)
export const copyToClipboard = (t: string) => pdfExportService.copyToClipboard(t)
