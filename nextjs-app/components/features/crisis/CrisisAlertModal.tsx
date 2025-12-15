/**
 * Crisis Alert Modal
 * Displays when user has concerning test results
 */

'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { CRISIS_HOTLINES } from '@/constants/tests/phq9-questions'
import { getPrimaryCrisisHotline, formatPhoneLink, submitCrisisAlert } from '@/services/crisis-alert.service'
import { Phone, AlertTriangle, Heart, MessageCircle, ExternalLink } from 'lucide-react'

interface CrisisAlertModalProps {
  isOpen: boolean
  onClose: () => void
  testType: string
  result: {
    totalScore: number
    crisisReason?: string
    question9Score?: number
    severityLevel?: string
  }
}

export function CrisisAlertModal({
  isOpen,
  onClose,
  testType,
  result,
}: CrisisAlertModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertSubmitted, setAlertSubmitted] = useState(false)

  const primaryHotline = getPrimaryCrisisHotline()
  const hasSuicidalIdeation = result.question9Score && result.question9Score > 0

  useEffect(() => {
    // Auto-submit crisis alert when modal opens
    if (isOpen && !alertSubmitted) {
      handleSubmitAlert()
    }
  }, [isOpen])

  const handleSubmitAlert = async () => {
    if (isSubmitting || alertSubmitted) return

    setIsSubmitting(true)
    try {
      await submitCrisisAlert({
        testType,
        severityLevel: result.severityLevel || 'severe',
        crisisReason: result.crisisReason || 'High severity score',
        totalScore: result.totalScore,
        question9Score: result.question9Score,
      })
      setAlertSubmitted(true)
    } catch (error) {
      console.error('Failed to submit crisis alert:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl text-red-700">
                {hasSuicidalIdeation ? 'Chúng tôi lo lắng cho bạn' : 'Kết quả đáng lo ngại'}
              </DialogTitle>
              <DialogDescription className="text-red-600">
                Vui lòng đọc kỹ thông tin bên dưới
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Message */}
          <Alert variant="destructive" className="border-red-300 bg-red-50">
            <Heart className="h-5 w-5" />
            <AlertTitle className="text-red-900">
              {hasSuicidalIdeation
                ? 'Bạn không đơn độc'
                : 'Bạn xứng đáng được hỗ trợ'}
            </AlertTitle>
            <AlertDescription className="text-red-800 mt-2">
              {hasSuicidalIdeation
                ? 'Nếu bạn đang có suy nghĩ về việc tự làm hại bản thân, xin hãy liên hệ ngay với đường dây hỗ trợ. Có người sẵn sàng lắng nghe và giúp đỡ bạn 24/7.'
                : 'Kết quả test cho thấy bạn có thể đang gặp khó khăn về sức khỏe tinh thần. Điều này hoàn toàn có thể được hỗ trợ và cải thiện.'}
            </AlertDescription>
          </Alert>

          {/* Primary Hotline - Highlighted */}
          <Card className="border-2 border-red-400 bg-gradient-to-r from-red-50 to-orange-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-red-800">
                    {primaryHotline.name}
                  </p>
                  <p className="text-sm text-red-600">
                    {primaryHotline.description}
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <a href={formatPhoneLink(primaryHotline.phone)}>
                    <Phone className="w-5 h-5" />
                    {primaryHotline.phone}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Other Hotlines */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Các đường dây hỗ trợ khác:
            </p>
            {CRISIS_HOTLINES.filter(h => h.phone !== primaryHotline.phone).map((hotline) => (
              <div
                key={hotline.phone}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{hotline.name}</p>
                  <p className="text-xs text-muted-foreground">{hotline.description}</p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <a href={formatPhoneLink(hotline.phone)}>
                    <Phone className="w-4 h-4" />
                    {hotline.phone}
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              <Heart className="w-4 h-4 inline-block mr-1 text-pink-500" />
              Miso luôn ở đây cùng bạn. Hãy cho chúng tôi biết nếu bạn cần giúp đỡ.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => window.open('https://www.who.int/health-topics/mental-health', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Tài liệu sức khỏe tinh thần
              </Button>

              <Button
                variant="default"
                className="flex-1 gap-2"
                onClick={onClose}
              >
                <MessageCircle className="w-4 h-4" />
                Tiếp tục xem kết quả
              </Button>
            </div>
          </div>

          {/* Notification Status */}
          {alertSubmitted && (
            <p className="text-xs text-center text-green-600">
              ✓ Mentor của bạn đã được thông báo về kết quả này
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
