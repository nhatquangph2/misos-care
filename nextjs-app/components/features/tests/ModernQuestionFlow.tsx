/**
 * ModernQuestionFlow Component
 * One question per screen with modern radio scale UI
 * Inspired by professional personality assessment platforms
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioScale, RadioScaleOption } from '@/components/RadioScale';

export interface ModernQuestion {
  id: number;
  question: string;
}

export interface ModernAnswer {
  questionId: number;
  value: number;
}

export interface ModernQuestionFlowProps {
  questions: ModernQuestion[];
  scaleOptions: RadioScaleOption[];
  onComplete: (answers: ModernAnswer[]) => void;
  testTitle: string;
  scaleInstruction?: string;
}

export function ModernQuestionFlow({
  questions,
  scaleOptions,
  onComplete,
  testTitle,
  scaleInstruction = 'Choose how accurately each statement reflects you.',
}: ModernQuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = answers.get(currentQuestion.id);

  const handleAnswer = (value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, value);
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }, 200);
    } else if (answers.size === totalQuestions) {
      // All questions answered, submit
      const answersArray: ModernAnswer[] = Array.from(answers.entries()).map(
        ([questionId, value]) => ({ questionId, value })
      );
      onComplete(answersArray);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleJumpTo = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 200);
    }
  };

  const canGoNext = currentAnswer !== undefined || currentIndex < totalQuestions - 1;
  const allAnswered = answers.size === totalQuestions;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {testTitle}
          </h1>
          <p className="text-gray-600">
            {scaleInstruction}
          </p>
        </div>

        {/* Question Display */}
        <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <RadioScale
            question={currentQuestion.question}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            options={scaleOptions}
            value={currentAnswer ?? null}
            onChange={handleAnswer}
            required
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </Button>

          {/* Progress Dots */}
          <div className="flex gap-2 overflow-x-auto max-w-md px-4">
            {questions.map((q, idx) => {
              const isAnswered = answers.has(q.id);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpTo(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    isCurrent
                      ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600'
                      : isAnswered
                      ? 'bg-green-500 hover:scale-125'
                      : 'bg-gray-300 hover:scale-125'
                  }`}
                  aria-label={`Question ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Next/Submit Button */}
          {isLastQuestion && allAnswered ? (
            <Button
              onClick={() => {
                const answersArray: ModernAnswer[] = Array.from(answers.entries()).map(
                  ([questionId, value]) => ({ questionId, value })
                );
                onComplete(answersArray);
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Submit ✓
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </Button>
          )}
        </div>

        {/* Question Number Indicator (Mobile friendly) */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {totalQuestions}
            {allAnswered && (
              <span className="ml-2 text-green-600 font-semibold">
                • All questions answered ✓
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
