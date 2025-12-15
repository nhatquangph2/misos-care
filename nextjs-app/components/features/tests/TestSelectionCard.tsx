/**
 * Animated Test Selection Card
 * Beautiful card component with GSAP hover effects
 */

'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCardHover } from '@/hooks/useGSAP'
import { Clock, FileText, Brain, Heart } from 'lucide-react'

interface TestSelectionCardProps {
  title: string
  description: string
  questionCount: number
  estimatedMinutes: number
  testType: 'personality' | 'mental-health'
  difficulty?: 'easy' | 'medium' | 'hard'
  recommended?: boolean
  onStart: () => void
}

export function TestSelectionCard({
  title,
  description,
  questionCount,
  estimatedMinutes,
  testType,
  difficulty = 'medium',
  recommended = false,
  onStart,
}: TestSelectionCardProps) {
  const cardRef = useCardHover<HTMLDivElement>()

  // Icon based on test type
  const Icon = testType === 'personality' ? Brain : Heart

  // Simplified color scheme - Professional
  const colorScheme = testType === 'personality'
    ? {
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        accentColor: 'text-primary',
        hoverBorder: 'hover:border-primary/50',
      }
    : {
        iconBg: 'bg-secondary',
        iconColor: 'text-white',
        accentColor: 'text-secondary',
        hoverBorder: 'hover:border-secondary/50',
      }

  const difficultyConfig = {
    easy: { label: 'Dễ', color: 'bg-green-50 text-green-700 border border-green-200' },
    medium: { label: 'Trung bình', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
    hard: { label: 'Khó', color: 'bg-red-50 text-red-700 border border-red-200' },
  }

  return (
    <Card
      ref={cardRef}
      className={`relative overflow-hidden glass-card shape-organic-1 transition-all duration-200 cursor-pointer group`}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-warning text-white border-0 px-3 py-1 text-xs font-semibold" aria-label="Recommended test">
            Đề xuất
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        {/* Professional Icon - Sized Appropriately */}
        <div className="mb-5">
          <div className={`w-14 h-14 rounded-2xl ${colorScheme.iconBg} flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
            <Icon className={`w-7 h-7 ${colorScheme.iconColor}`} strokeWidth={2} />
          </div>
        </div>

        <CardTitle className="text-xl font-bold mb-2 leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats - Clean and Professional */}
        <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>{questionCount} câu hỏi</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>~{estimatedMinutes} phút</span>
          </div>
        </div>

        {/* Difficulty Badge - Minimal */}
        <div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${difficultyConfig[difficulty].color}`}>
            {difficultyConfig[difficulty].label}
          </span>
        </div>

        {/* Info box - Subtle */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg border border-border">
          <span className="font-medium text-foreground">Lưu ý:</span> Hãy trả lời trung thực để kết quả chính xác.
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={onStart}
          className="w-full font-semibold"
          aria-label={`Bắt đầu ${title}`}
        >
          Bắt đầu test
        </Button>
      </CardFooter>
    </Card>
  )
}
