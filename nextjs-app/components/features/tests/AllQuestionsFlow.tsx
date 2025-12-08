/**
 * AllQuestionsFlow Component
 * Display all questions at once with scroll, like professional personality tests
 * Legend shown once at the top, questions below with color-coded options
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export interface ScaleOption {
  value: number;
  label: string;
  shortLabel?: string; // For display below question
  color: string; // Tailwind border/bg color
}

export interface Question {
  id: number;
  question: string;
}

export interface Answer {
  questionId: number;
  value: number;
}

export interface AllQuestionsFlowProps {
  questions: Question[];
  scaleOptions: ScaleOption[];
  onComplete: (answers: Answer[]) => void;
  testTitle: string;
  scaleInstruction?: string;
}

export function AllQuestionsFlow({
  questions,
  scaleOptions,
  onComplete,
  testTitle,
  scaleInstruction = 'Choose how accurately each statement reflects you.',
}: AllQuestionsFlowProps) {
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (answers.size / questions.length) * 100;
  const allAnswered = answers.size === questions.length;

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, value);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (allAnswered && !isSubmitting) {
      setIsSubmitting(true);
      const answersArray: Answer[] = Array.from(answers.entries()).map(
        ([questionId, value]) => ({ questionId, value })
      );
      onComplete(answersArray);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Title and Progress Badge */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{testTitle}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">{progress.toFixed(0)}%</span>
              <div className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {answers.size} / {questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              {allAnswered ? 'Hoàn thành' : 'Đang thực hiện'}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Scale Legend - Show once at top */}
          <div className="mt-6">
            <p className="text-center text-base text-gray-700 font-medium mb-4">
              {scaleInstruction}
            </p>
            <div className="flex justify-between items-start max-w-4xl mx-auto">
              {scaleOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full border-4 ${option.color} mb-2 transition-transform hover:scale-110`}
                  />
                  <div className="text-center px-2">
                    <div className="text-xs font-medium text-gray-900 leading-tight max-w-[100px]">
                      {option.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {questions.map((question) => {
          const answer = answers.get(question.id);
          const isAnswered = answer !== undefined;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 ${
                isAnswered
                  ? 'border-teal-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Question Number Badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isAnswered
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isAnswered ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    question.id
                  )}
                </div>

                {/* Question Text */}
                <div className="flex-1">
                  <p className="text-base text-gray-800 leading-relaxed font-medium">
                    {question.question}
                  </p>
                </div>
              </div>

              {/* Answer Options */}
              <div className="flex justify-between items-center pl-14">
                {/* Left Label */}
                <div className="text-xs text-gray-500 font-medium w-24 text-left">
                  {scaleOptions[0].shortLabel || scaleOptions[0].label.split(' ')[0]}
                </div>

                {/* Radio Options */}
                <div className="flex gap-4 flex-1 justify-center">
                  {scaleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={`group relative transition-all duration-200 ${
                        answer === option.value ? 'scale-110' : 'hover:scale-105'
                      }`}
                      aria-label={option.label}
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-4 ${option.color} flex items-center justify-center cursor-pointer transition-all ${
                          answer === option.value
                            ? 'shadow-lg ring-4 ring-opacity-30 ' +
                              option.color.replace('border-', 'ring-')
                            : 'hover:shadow-md'
                        }`}
                      >
                        {answer === option.value && (
                          <svg
                            className="w-6 h-6 text-current"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                          {option.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Label */}
                <div className="text-xs text-gray-500 font-medium w-24 text-right">
                  {scaleOptions[scaleOptions.length - 1].shortLabel ||
                    scaleOptions[scaleOptions.length - 1].label.split(' ').slice(-2).join(' ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Submit Bar */}
      <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {allAnswered ? (
                <span className="text-green-600 font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đã trả lời tất cả câu hỏi!
                </span>
              ) : (
                <span className="text-gray-600">
                  Còn lại: <span className="font-semibold">{questions.length - answers.size}</span> câu
                </span>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                allAnswered && !isSubmitting
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </span>
              ) : (
                'Hoàn thành'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
