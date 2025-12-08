/**
 * PHQ-9 Test Page (All Questions UI Version)
 * Patient Health Questionnaire with all questions visible at once
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllQuestionsFlow } from '@/components/features/tests/AllQuestionsFlow';
import { PHQ9_QUESTIONS, PHQ9_SEVERITY, CRISIS_THRESHOLD } from '@/constants/tests/phq9-questions';

// Define scale for PHQ-9 (4-level frequency scale)
const PHQ9_SCALE = [
  {
    value: 0,
    label: 'Không bao giờ',
    shortLabel: 'Không',
    color: 'border-green-400 text-green-500',
  },
  {
    value: 1,
    label: 'Vài ngày',
    shortLabel: 'Vài ngày',
    color: 'border-yellow-400 text-yellow-600',
  },
  {
    value: 2,
    label: 'Hơn nửa số ngày',
    shortLabel: 'Hơn nửa',
    color: 'border-orange-400 text-orange-500',
  },
  {
    value: 3,
    label: 'Gần như mỗi ngày',
    shortLabel: 'Mỗi ngày',
    color: 'border-red-400 text-red-500',
  },
];

export default function PHQ9V2TestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Convert PHQ9_QUESTIONS to simple format
  const questions = PHQ9_QUESTIONS.map((q) => ({
    id: q.id,
    question: q.question,
  }));

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true);

    try {
      // Calculate total score
      const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);

      // Determine severity level
      let severity: typeof PHQ9_SEVERITY[keyof typeof PHQ9_SEVERITY] = PHQ9_SEVERITY.minimal;
      if (totalScore >= PHQ9_SEVERITY.severe.min) severity = PHQ9_SEVERITY.severe;
      else if (totalScore >= PHQ9_SEVERITY.moderatelySevere.min)
        severity = PHQ9_SEVERITY.moderatelySevere;
      else if (totalScore >= PHQ9_SEVERITY.moderate.min) severity = PHQ9_SEVERITY.moderate;
      else if (totalScore >= PHQ9_SEVERITY.mild.min) severity = PHQ9_SEVERITY.mild;

      // Check for crisis (question 9 - suicidal ideation)
      const question9Answer = answers.find((a) => a.questionId === 9);
      const hasSuicidalIdeation = question9Answer && question9Answer.value > 0;
      const needsCrisisIntervention =
        hasSuicidalIdeation || totalScore >= CRISIS_THRESHOLD.totalScore;

      const result = {
        totalScore,
        severity,
        hasSuicidalIdeation,
        needsCrisisIntervention,
      };

      // Store results in localStorage
      localStorage.setItem('phq9_result', JSON.stringify(result));
      localStorage.setItem('phq9_answers', JSON.stringify(answers));
      localStorage.setItem('phq9_completed_at', new Date().toISOString());

      // Navigate to results page
      router.push('/tests/phq9/results');
    } catch (error) {
      console.error('Error calculating PHQ-9:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-800">Đang phân tích kết quả...</p>
          <p className="text-sm text-gray-600 mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <AllQuestionsFlow
      questions={questions}
      scaleOptions={PHQ9_SCALE}
      onComplete={handleComplete}
      testTitle="PHQ-9 - Sàng lọc Trầm cảm"
      scaleInstruction="Trong 2 tuần qua, bạn có gặp phải các vấn đề sau với tần suất như thế nào?"
    />
  );
}
