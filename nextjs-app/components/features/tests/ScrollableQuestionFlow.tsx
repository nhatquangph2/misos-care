/**
 * ScrollableQuestionFlow Component
 * All questions visible at once with scroll animations
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

interface ScrollableQuestionFlowProps {
  questions: Question[]
  onComplete: (answers: Answer[]) => void
  testTitle: string
  testType?: 'personality' | 'mental-health'
}

export function ScrollableQuestionFlow({
  questions,
  onComplete,
  testTitle,
  testType = 'personality',
}: ScrollableQuestionFlowProps) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(questions[0]?.id)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const progress = (answers.length / questions.length) * 100
  const allAnswered = answers.length === questions.length

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Setup scroll trigger for each question
    questionRefs.current.forEach((ref, index) => {
      if (!ref) return

      // Only animate if user doesn't prefer reduced motion
      if (!prefersReducedMotion) {
        // Fade in animation on scroll
        gsap.fromTo(
          ref,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ref,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else {
        // Set to visible immediately without animation
        gsap.set(ref, { opacity: 1, y: 0 })
      }

      // Track which question is in view
      ScrollTrigger.create({
        trigger: ref,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentQuestionId(questions[index].id),
        onEnterBack: () => setCurrentQuestionId(questions[index].id),
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [questions])

  const handleAnswer = (questionId: number, value: number) => {
    // Remove old answer for this question if exists
    const newAnswers = answers.filter(a => a.questionId !== questionId)
    newAnswers.push({ questionId, value })
    setAnswers(newAnswers)

    // Animate selection only if user doesn't prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const button = document.querySelector(`[data-question="${questionId}"][data-value="${value}"]`)
    if (button && !prefersReducedMotion) {
      gsap.fromTo(
        button,
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      )
    }

    // Scroll to next unanswered question
    const nextUnansweredIndex = questions.findIndex(
      q => !newAnswers.some(a => a.questionId === q.id) && q.id > questionId
    )

    if (nextUnansweredIndex !== -1 && questionRefs.current[nextUnansweredIndex]) {
      setTimeout(() => {
        questionRefs.current[nextUnansweredIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)
    }
  }

  const handleComplete = () => {
    if (allAnswered) {
      onComplete(answers)
    }
  }

  const getQuestionOpacity = (questionId: number): string => {
    const isAnswered = answers.some(a => a.questionId === questionId)
    const isCurrent = questionId === currentQuestionId

    if (isCurrent) return 'opacity-100'
    if (isAnswered) return 'opacity-60'
    return 'opacity-40'
  }

  const getQuestionWeight = (questionId: number): string => {
    return questionId === currentQuestionId ? 'font-bold' : 'font-medium'
  }

  const colorScheme = testType === 'personality'
    ? {
        primary: 'bg-primary',
        text: 'text-primary',
        border: 'border-primary',
        ring: 'ring-primary/30',
      }
    : {
        primary: 'bg-secondary',
        text: 'text-secondary',
        border: 'border-secondary',
        ring: 'ring-secondary/30',
      }

  return (
    <div className="min-h-screen pb-32 bg-background relative" ref={containerRef}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm relative">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">{testTitle}</h1>
            <div className={`text-sm font-semibold text-white ${colorScheme.primary} px-5 py-2 rounded-full shadow-md`}>
              {answers.length} / {questions.length}
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-muted" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">
                {allAnswered ? 'Hoàn thành' : 'Đang thực hiện'}
              </span>
              <span className={`font-semibold ${colorScheme.text}`}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {questions.map((question, index) => {
          const answer = answers.find(a => a.questionId === question.id)
          const isAnswered = !!answer
          const isCurrent = question.id === currentQuestionId

          return (
            <div
              key={question.id}
              ref={(el) => {
                questionRefs.current[index] = el
              }}
              className={`transition-all duration-500 ${getQuestionOpacity(question.id)}`}
            >
              <Card className={`
                transition-all duration-300 overflow-hidden
                ${isCurrent ? `ring-2 ${colorScheme.border} shadow-2xl scale-[1.02]` : 'shadow-md hover:shadow-lg'}
                ${isAnswered ? 'bg-gradient-to-br from-card to-muted/30' : 'bg-card'}
              `}>
                <CardContent className="pt-8 pb-8 px-8">
                  {/* Question Number */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`
                      inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-md
                      ${isAnswered
                        ? 'bg-success text-white'
                        : `${colorScheme.primary} text-white`
                      }
                    `}>
                      {isAnswered ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-base">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <span className={`text-sm font-medium ${colorScheme.text}`}>
                        Câu {index + 1}/{questions.length}
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className={`
                    text-lg md:text-xl mb-8 leading-relaxed transition-all
                    ${getQuestionWeight(question.id)}
                    ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {question.question}
                  </h3>

                  {/* Answer Options - Likert Scale */}
                  <div className="flex items-center justify-between gap-6">
                    {/* Left Label */}
                    <span className="text-sm font-semibold text-muted-foreground w-28 text-left">
                      {question.options[0]?.label || 'Đồng ý'}
                    </span>

                    {/* Dots */}
                    <div className="flex items-center gap-4 flex-1 justify-center">
                      {question.options.map((option) => {
                        const isSelected = answer?.value === option.value

                        return (
                          <button
                            key={option.value}
                            data-question={question.id}
                            data-value={option.value}
                            onClick={() => handleAnswer(question.id, option.value)}
                            className={`
                              relative w-12 h-12 rounded-full transition-all duration-200
                              ${isSelected
                                ? `${colorScheme.primary} scale-110 shadow-lg ring-4 ring-offset-2 ${colorScheme.ring}`
                                : `bg-white border-2 ${colorScheme.border} border-opacity-30 hover:${colorScheme.border} hover:border-opacity-60 hover:scale-105 hover:shadow-md`
                              }
                              ${isCurrent ? 'opacity-100' : 'opacity-60'}
                              active:scale-95
                            `}
                            title={option.description || option.label}
                            aria-label={`${option.label} - ${option.description || ''}`}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Right Label */}
                    <span className="text-sm font-semibold text-muted-foreground w-28 text-right">
                      {question.options[question.options.length - 1]?.label || 'Không đồng ý'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Fixed Complete Button */}
      {allAnswered && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleComplete}
              size="lg"
              className="w-full text-base font-semibold"
            >
              Hoàn thành và xem kết quả
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
