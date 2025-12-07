/**
 * QuestionFlow Component
 * Animated question display with smooth transitions
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useSlideIn } from '@/hooks/useGSAP'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: {
    value: number
    label: string
    description?: string
  }[]
}

interface Answer {
  questionId: number
  value: number
}

interface QuestionFlowProps {
  questions: Question[]
  onComplete: (answers: Answer[]) => void
  testTitle: string
  testType?: 'personality' | 'mental-health'
}

export function QuestionFlow({
  questions,
  onComplete,
  testTitle,
  testType = 'personality',
}: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isLastQuestion = currentIndex === questions.length - 1
  const isFirstQuestion = currentIndex === 0

  // Check if current question is answered
  const existingAnswer = answers.find((a) => a.questionId === currentQuestion.id)

  useEffect(() => {
    if (existingAnswer) {
      setSelectedValue(existingAnswer.value)
    } else {
      setSelectedValue(null)
    }
  }, [currentIndex, existingAnswer])

  // Animate question transition
  useEffect(() => {
    const card = document.getElementById('question-card')
    if (!card) return

    const slideX = direction === 'forward' ? 50 : -50

    gsap.fromTo(
      card,
      {
        x: slideX,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }
    )
  }, [currentIndex, direction])

  const handleAnswer = (value: number) => {
    setSelectedValue(value)

    // Animate selection
    const button = document.querySelector(`[data-value="${value}"]`)
    if (button) {
      gsap.fromTo(
        button,
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: 'back.out(3)' }
      )
    }
  }

  const handleNext = () => {
    if (selectedValue === null) return

    // Save answer
    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id)
    newAnswers.push({
      questionId: currentQuestion.id,
      value: selectedValue,
    })
    setAnswers(newAnswers)

    if (isLastQuestion) {
      // Complete test
      onComplete(newAnswers)
    } else {
      // Go to next question
      setDirection('forward')
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (isFirstQuestion) return
    setDirection('backward')
    setCurrentIndex(currentIndex - 1)
  }

  const colorScheme = testType === 'personality'
    ? 'from-purple-500 to-pink-500'
    : 'from-blue-500 to-teal-500'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{testTitle}</h2>
          <Badge variant="secondary">
            Câu {currentIndex + 1} / {questions.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground text-right">
            {Math.round(progress)}% hoàn thành
          </p>
        </div>
      </div>

      {/* Question Card */}
      <Card id="question-card" className="shadow-xl border-2">
        <CardContent className="pt-8 pb-6">
          {/* Question Number Badge */}
          <div className="mb-6">
            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${colorScheme} text-white font-semibold`}>
              Câu hỏi {currentIndex + 1}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedValue === option.value

              return (
                <button
                  key={option.value}
                  data-value={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all text-left
                    ${isSelected
                      ? `border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio Circle */}
                    <div className={`
                      mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                      ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Option Content */}
                    <div className="flex-1">
                      <div className={`font-medium ${isSelected ? 'text-purple-700 dark:text-purple-300' : ''}`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>

        {/* Navigation Buttons */}
        <CardFooter className="flex justify-between gap-4 pb-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedValue === null}
            className={`gap-2 bg-gradient-to-r ${colorScheme} hover:opacity-90`}
          >
            {isLastQuestion ? (
              <>
                <Check className="w-4 h-4" />
                Hoàn thành
              </>
            ) : (
              <>
                Tiếp theo
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Helper Text */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        💡 <strong>Mẹo:</strong> Chọn câu trả lời đầu tiên xuất hiện trong đầu bạn
      </p>
    </div>
  )
}
