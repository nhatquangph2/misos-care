'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OceanQuestionView from './OceanQuestionView';
import { QuestionTimeline } from './QuestionTimeline';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

interface Answer {
  questionId: number;
  value: number;
}

interface OceanTestFlowProps {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  testTitle: string;
  testType?: 'personality' | 'mental-health';
}

/**
 * OceanTestFlow - Immersive ocean-themed test flow
 * Hiển thị từng câu hỏi với bubble interactions
 */
export function OceanTestFlow({
  questions,
  onComplete,
  testTitle,
  testType = 'personality',
}: OceanTestFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = (answers.length / questions.length) * 100;
  const isComplete = answers.length === questions.length;

  const handleAnswer = (value: number) => {
    // Save answer
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: value,
    };

    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = newAnswer;
    } else {
      newAnswers.push(newAnswer);
    }

    setAnswers(newAnswers);

    // Move to next question or show completion
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
    } else {
      // Last question answered
      setTimeout(() => {
        setShowCompletion(true);
      }, 500);
    }
  };

  const handleBack = () => {
    if (showCompletion) {
      // Quay lại từ completion screen
      setShowCompletion(false);
      setCurrentIndex(questions.length - 1);
    } else if (currentIndex > 0) {
      // Quay lại câu trước
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const handleNavigate = (index: number) => {
    if (showCompletion) {
      setShowCompletion(false);
    }
    setCurrentIndex(index);
  };

  // Get previous answer for current question if exists
  const previousAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  // Get list of answered question indices
  const answeredIndices = answers.map(a =>
    questions.findIndex(q => q.id === a.questionId)
  ).filter(i => i !== -1);

  return (
    <div className="relative min-h-screen w-full">
      {/* Header - Test title */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gradient-to-b from-black/30 to-transparent py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-heading font-bold text-white">
              {testTitle}
            </h1>
          </div>

          {/* Timeline Navigation */}
          {!showCompletion && (
            <QuestionTimeline
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredQuestions={answeredIndices}
              onNavigate={handleNavigate}
            />
          )}

          {/* Progress bar for completion screen */}
          {showCompletion && (
            <div className="mt-4 max-w-4xl mx-auto">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="pt-32">
        <AnimatePresence mode="wait">
          {!showCompletion ? (
            <OceanQuestionView
              key={currentIndex}
              question={currentQuestion.question}
              options={currentQuestion.options}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              selectedValue={previousAnswer?.value}
            />
          ) : (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center space-y-8 px-4">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]"
                >
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>

                {/* Completion message */}
                <div className="space-y-3">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-5xl font-heading font-bold text-white"
                  >
                    Hoàn thành! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-white/80"
                  >
                    Bạn đã trả lời tất cả {questions.length} câu hỏi
                  </motion.p>
                </div>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="btn-liquid text-lg px-8 py-6"
                  >
                    Xem kết quả
                  </Button>
                </motion.div>

                {/* Bubbles earned indicator */}
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    <span className="text-2xl">🫧</span>
                    <span className="text-white font-medium">+50 Bubbles</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
