/**
 * AI Consultant Chat Component
 * Evidence-based behavioral science consultation
 */

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Brain,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { ConsultationRequest, ConsultationResponse } from '@/services/ai-consultant.service'
import type { BFI2Score } from '@/constants/tests/bfi2-questions'

interface AIConsultantChatProps {
  big5Score: BFI2Score
  mbtiType?: string
  viaStrengths?: string[]
}

export function AIConsultantChat({ big5Score, mbtiType, viaStrengths }: AIConsultantChatProps) {
  const [issue, setIssue] = useState<ConsultationRequest['issue']>('general')
  const [situation, setSituation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ConsultationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const requestBody: ConsultationRequest = {
        userProfile: {
          big5Score,
          mbtiType,
          viaStrengths,
        },
        issue,
        specificSituation: situation,
      }

      const res = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI consultation')
      }

      setResponse(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const issueOptions: { value: ConsultationRequest['issue']; label: string; emoji: string }[] = [
    { value: 'stress', label: 'Stress & Burnout', emoji: '😰' },
    { value: 'anxiety', label: 'Lo âu', emoji: '😟' },
    { value: 'depression', label: 'Trầm cảm', emoji: '😔' },
    { value: 'procrastination', label: 'Trì hoãn', emoji: '⏰' },
    { value: 'relationships', label: 'Quan hệ', emoji: '💔' },
    { value: 'general', label: 'Chung', emoji: '💬' },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Tư Vấn AI Khoa Học Hành Vi
        </CardTitle>
        <CardDescription>
          Nhận gợi ý dựa trên CBT, ACT, Problem-Solving Therapy và tính cách của bạn
        </CardDescription>
        <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lưu ý quan trọng</AlertTitle>
          <AlertDescription>
            AI này KHÔNG thay thế chuyên gia sức khỏe tinh thần. Chỉ đưa ra gợi ý dựa trên nghiên cứu khoa học.
            <br />
            <strong>NGHIÊM CẤM:</strong> Meditation, mindfulness, spiritual practices.
            <br />
            <strong>CHỈ CHO PHÉP:</strong> CBT, ACT, Behavioral interventions, Skills training.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Vấn đề bạn đang gặp phải:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {issueOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIssue(opt.value)}
                  className={`p-3 border rounded-lg text-sm transition-all ${
                    issue === opt.value
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <br />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Situation Input */}
          <div>
            <label htmlFor="situation" className="block text-sm font-medium mb-2">
              Mô tả tình huống cụ thể: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              required
              rows={5}
              placeholder="Ví dụ: Tôi đang bị stress vì khối lượng công việc quá nhiều. Sếp liên tục giao thêm việc mặc dù tôi đã làm việc 10 giờ/ngày. Tôi cảm thấy kiệt sức và lo âu về việc không hoàn thành deadline..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Càng cụ thể càng tốt. AI sẽ phân tích và đưa ra giải pháp dựa trên CBT/ACT.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !situation.trim()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang phân tích với AI...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Nhận tư vấn từ AI
              </>
            )}
          </Button>
        </form>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* AI Response */}
        {response && (
          <div className="space-y-6 border-t pt-6">
            {/* Situation Analysis */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Phân Tích Tình Huống
              </h3>
              <p className="text-sm">{response.situationAnalysis}</p>
            </div>

            {/* Root Causes */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Nguyên Nhân Gốc Rễ
              </h3>
              <ul className="space-y-2">
                {response.rootCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">●</span>
                    <span className="text-sm">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence-Based Solution */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-lg mb-3">✅ Giải Pháp Dựa Trên Khoa Học</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Phương pháp chính:</strong> {response.evidenceBasedSolution.primaryApproach}</p>
                <p><strong>Cơ sở nghiên cứu:</strong> {response.evidenceBasedSolution.researchBacking}</p>
                <p><strong>Tại sao phù hợp:</strong> {response.evidenceBasedSolution.whyThisApproach}</p>
              </div>
            </div>

            {/* Action Steps */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Các Bước Hành Động Cụ Thể
              </h3>
              <div className="space-y-3">
                {response.actionSteps.map((step) => (
                  <div key={step.step} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Bước {step.step}</Badge>
                      <Badge variant="outline">{step.timeframe}</Badge>
                    </div>
                    <p className="text-sm mb-2"><strong>Hành động:</strong> {step.action}</p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Đo lường:</strong> {step.measurableOutcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Outcome */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-2 border-amber-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Kết Quả Kỳ Vọng
              </h3>
              <p className="text-sm">{response.expectedOutcome}</p>
            </div>

            {/* When to Seek Professional */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>⚠️ Khi Nào Cần Gặp Chuyên Gia</AlertTitle>
              <AlertDescription>
                <ul className="space-y-1 mt-2">
                  {response.whenToSeekProfessional.map((condition, i) => (
                    <li key={i} className="text-sm">• {condition}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>

            {/* Resources */}
            {response.resources.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Tài Nguyên Khoa Học
                </h3>
                <div className="space-y-2">
                  {response.resources.map((resource, i) => (
                    <div key={i} className="border rounded-lg p-3 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <p className="font-semibold text-sm">{resource.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
