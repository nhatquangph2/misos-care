'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Compass, Sparkles, Waves } from 'lucide-react'

import OceanBackground from '@/components/gamification/OceanBackground'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

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

interface OceanQuestionFlowProps {
  questions: Question[]
  onComplete: (answers: Answer[]) => void
  testTitle: string
  testType?: 'personality' | 'mental-health'
}

const bubblePalettes = [
  {
    gradient: 'from-cyan-300/50 via-blue-500/40 to-indigo-500/30',
    chip: 'linear-gradient(135deg, #67e8f9, #3b82f6 60%, #818cf8)',
  },
  {
    gradient: 'from-emerald-300/60 via-teal-400/45 to-sky-500/35',
    chip: 'linear-gradient(135deg, #6ee7b7, #14b8a6 60%, #38bdf8)',
  },
  {
    gradient: 'from-purple-300/60 via-indigo-400/50 to-cyan-400/40',
    chip: 'linear-gradient(135deg, #c4b5fd, #818cf8 60%, #22d3ee)',
  },
  {
    gradient: 'from-pink-300/60 via-fuchsia-400/50 to-purple-500/35',
    chip: 'linear-gradient(135deg, #f9a8d4, #e879f9 60%, #a855f7)',
  },
  {
    gradient: 'from-amber-200/60 via-orange-300/55 to-rose-400/35',
    chip: 'linear-gradient(135deg, #fcd34d, #fb923c 55%, #fb7185)',
  },
]

export function OceanQuestionFlow({
  questions,
  onComplete,
  testTitle,
  testType = 'personality',
}: OceanQuestionFlowProps) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions === 0 ? 0 : (answers.length / totalQuestions) * 100

  const oceanLevel = useMemo(() => {
    if (!totalQuestions) return 1
    const depth = Math.min(1, Math.max(0, answers.length / totalQuestions))
    return Math.max(1, Math.min(5, Math.round(1 + depth * 4)))
  }, [answers.length, totalQuestions])

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  useEffect(() => {
    setAnswers([])
    setCurrentIndex(0)
    setHasSubmitted(false)
  }, [questions])

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return

    const nextAnswers = [
      ...answers.filter((a) => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, value },
    ]

    setAnswers(nextAnswers)

    const nextIndex = currentIndex + 1
    if (nextIndex < totalQuestions) {
      setTimeout(() => setCurrentIndex(nextIndex), 420)
    } else {
      if (!hasSubmitted) {
        setHasSubmitted(true)
        setTimeout(() => onComplete(nextAnswers), 480)
      }
    }
  }

  const scaleOptions = useMemo(() => currentQuestion?.options || [], [currentQuestion?.options])

  const getBubbleSize = (index: number) => {
    const base = 80
    return base + index * 14
  }

  const getBubblePalette = (index: number) => {
    return bubblePalettes[index % bubblePalettes.length]
  }

  const isAnswered = (questionId: number) => answers.some((a) => a.questionId === questionId)

  const currentValue = answers.find((a) => a.questionId === currentQuestion?.id)?.value

  if (totalQuestions === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden text-white">
        <OceanBackground oceanLevel={1} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.35)_75%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold drop-shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            Hiện chưa có câu hỏi nào
          </h2>
          <p className="text-base sm:text-lg text-white/75">
            Vui lòng quay lại sau khi bộ câu hỏi được cập nhật hoặc thử một bài đánh giá khác.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <OceanBackground oceanLevel={oceanLevel} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.35)_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(125,211,252,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.14),transparent_40%)]" />

      {/* Ripple cursor */}
      <div
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 mix-blend-screen blur-3xl"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          width: 240,
          height: 240,
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.35), rgba(56,189,248,0.18), transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10">
        <div className="flex items-start gap-4 md:gap-6">
          <div className="hidden md:flex flex-col items-center pt-2 w-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-white/50 via-white/20 to-transparent" />
            <motion.div
              className={cn(
                'w-12 h-12 rounded-full shadow-lg flex items-center justify-center backdrop-blur-xl border border-white/30',
                testType === 'mental-health'
                  ? 'bg-gradient-to-br from-teal-300/30 via-cyan-500/25 to-blue-700/40'
                  : 'bg-gradient-to-br from-purple-300/30 via-sky-500/25 to-blue-700/40'
              )}
              animate={{ y: `${(progress / 100) * 440}%` }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            >
              <Compass className="w-6 h-6 text-white drop-shadow" />
            </motion.div>
            <div className="mt-64 h-64" />
          </div>

          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-sm font-medium">
                  <Waves className="w-4 h-4" />
                  <span>{testTitle}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>{answers.length} / {totalQuestions} câu</span>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-white/10" />
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{answers.length === totalQuestions ? 'Sẵn sàng xem kết quả' : 'Đang lặn sâu khám phá bạn'}</span>
                  <span className="font-semibold text-white">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[auto,1fr] gap-6 lg:gap-10 items-start">
              <div className="hidden lg:flex flex-col items-center gap-3 pt-4">
                {questions.map((question, idx) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      'group relative w-12 h-12 rounded-full border transition-all duration-200 backdrop-blur-xl',
                      currentIndex === idx
                        ? 'border-white/80 bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.35)]'
                        : isAnswered(question.id)
                          ? 'border-emerald-200/80 bg-emerald-200/20 hover:bg-emerald-200/30'
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                    )}
                    title={`Đến câu ${idx + 1}`}
                  >
                    {isAnswered(question.id) ? (
                      <Check className="w-5 h-5 text-white drop-shadow" />
                    ) : (
                      <span className="text-sm font-semibold text-white/80">{idx + 1}</span>
                    )}
                    <div className="absolute -right-14 top-1/2 -translate-y-1/2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Câu {idx + 1}
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative overflow-visible p-6 sm:p-10">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.25),rgba(14,116,144,0.05)_55%,transparent_70%)] blur-2xl" />
                <div className="pointer-events-none absolute -top-32 -left-24 w-72 h-72 bg-white/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 right-10 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-transparent blur-[100px]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_90%,rgba(59,130,246,0.2),transparent_60%)]" />

                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-white/60 mb-6">
                  <span>Lặn sâu</span>
                  <span>
                    Câu {currentIndex + 1}
                    <span className="text-white/50"> / {totalQuestions}</span>
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion?.id}
                    initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -24, filter: 'blur(12px)' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="space-y-10"
                  >
                    <h2 className="text-3xl sm:text-4xl font-heading font-semibold leading-tight drop-shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                      {currentQuestion?.question}
                    </h2>

                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                      {scaleOptions.map((option, idx) => {
                        const size = getBubbleSize(idx)
                        const palette = getBubblePalette(idx)
                        const selected = currentValue === option.value

                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className={cn(
                              'relative rounded-full border border-white/30 text-center text-white font-semibold shadow-[0_20px_60px_rgba(0,0,0,0.25)]',
                              'backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                              'transition-[transform,filter] duration-300'
                            )}
                            style={{ width: size, height: size }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 1.4, opacity: 0 }}
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 2, -1, 0],
                            }}
                            transition={{
                              duration: 3 + idx * 0.2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <div
                              className={cn(
                                'absolute inset-0 rounded-full',
                                `bg-gradient-to-br ${palette.gradient}`,
                                selected ? 'shadow-[0_0_45px_rgba(255,255,255,0.25)]' : 'shadow-[0_0_25px_rgba(255,255,255,0.12)]'
                              )}
                            />
                            <div className="absolute top-2 left-2 w-2/5 h-2/5 rounded-full bg-white/60 blur-lg opacity-60" />
                            <span className="relative z-10 text-sm sm:text-base drop-shadow">
                              {option.label}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex flex-wrap gap-3 items-center justify-between text-xs text-white/70">
                  <div className="flex flex-wrap gap-2 items-center">
                    {scaleOptions.map((option, idx) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl"
                      >
                        <span
                          className="block w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundImage: getBubblePalette(idx).chip,
                          }}
                        />
                        <span className="font-medium text-white/80">{option.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-white/20" />
                    <span className="uppercase tracking-[0.3em]">Hít thở sâu</span>
                  </div>
                </div>

                {answers.length === totalQuestions && !hasSubmitted && (
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        if (hasSubmitted) return
                        setHasSubmitted(true)
                        onComplete(answers)
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/20 border border-white/30 px-6 py-3 text-base font-semibold shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:bg-white/30"
                    >
                      <Check className="w-5 h-5" />
                      Xem kết quả
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
