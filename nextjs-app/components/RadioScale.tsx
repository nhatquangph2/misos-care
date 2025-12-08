/**
 * RadioScale Component
 * Modern radio button scale with color-coded options
 * Inspired by professional personality test UIs
 */

'use client';

import { useState } from 'react';

export interface RadioScaleOption {
  value: number;
  label: string;
  color: string; // Tailwind color class
}

export interface RadioScaleProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  options: RadioScaleOption[];
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
}

export function RadioScale({
  question,
  questionNumber,
  totalQuestions,
  options,
  value,
  onChange,
  required = false,
}: RadioScaleProps) {
  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="w-full animate-scaleIn">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{progress.toFixed(0)}%</span>
          <span>Step {questionNumber} of {totalQuestions}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scale Legend - Show once at top */}
      <div className="mb-8">
        <p className="text-center text-lg text-gray-700 font-medium mb-6">
          Choose how accurately each statement reflects you.
        </p>
        <div className="flex justify-between items-center max-w-3xl mx-auto px-4">
          {options.map((option) => (
            <div key={option.value} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-4 ${option.color} mb-2 transition-transform hover:scale-110`}
              />
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 leading-tight max-w-[80px]">
                  {option.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <p className="text-xl text-gray-800 text-center mb-6 leading-relaxed">
          {question}
        </p>

        {/* Radio Options */}
        <div className="flex justify-between items-center max-w-3xl mx-auto px-4">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative group transition-all duration-200 ${
                value === option.value ? 'scale-110' : 'hover:scale-105'
              }`}
              aria-label={option.label}
            >
              <div
                className={`w-16 h-16 rounded-full border-4 ${option.color} flex items-center justify-center cursor-pointer transition-all ${
                  value === option.value
                    ? 'shadow-lg ring-4 ring-opacity-30 ' + option.color.replace('border-', 'ring-')
                    : 'hover:shadow-md'
                }`}
              >
                {value === option.value && (
                  <svg
                    className="w-8 h-8 text-current"
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
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {option.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Required indicator */}
      {required && !value && (
        <p className="text-sm text-gray-500 text-center mt-2">
          * Please select an option to continue
        </p>
      )}
    </div>
  );
}

// Default scale configurations
export const LIKERT_5_SCALE: RadioScaleOption[] = [
  { value: 1, label: 'Strongly Disagree', color: 'border-red-300 text-red-500' },
  { value: 2, label: 'Disagree', color: 'border-orange-300 text-orange-500' },
  { value: 3, label: 'Neutral', color: 'border-gray-300 text-gray-500' },
  { value: 4, label: 'Agree', color: 'border-green-300 text-green-500' },
  { value: 5, label: 'Strongly Agree', color: 'border-teal-500 text-teal-600' },
];

export const LIKERT_5_SCALE_VI: RadioScaleOption[] = [
  { value: 1, label: 'Hoàn toàn không đồng ý', color: 'border-red-300 text-red-500' },
  { value: 2, label: 'Không đồng ý', color: 'border-orange-300 text-orange-500' },
  { value: 3, label: 'Trung lập', color: 'border-gray-300 text-gray-500' },
  { value: 4, label: 'Đồng ý', color: 'border-green-300 text-green-500' },
  { value: 5, label: 'Hoàn toàn đồng ý', color: 'border-teal-500 text-teal-600' },
];

export const FREQUENCY_4_SCALE: RadioScaleOption[] = [
  { value: 0, label: 'Not at all', color: 'border-green-300 text-green-500' },
  { value: 1, label: 'Several days', color: 'border-yellow-300 text-yellow-600' },
  { value: 2, label: 'More than half the days', color: 'border-orange-300 text-orange-500' },
  { value: 3, label: 'Nearly every day', color: 'border-red-400 text-red-500' },
];

export const FREQUENCY_4_SCALE_VI: RadioScaleOption[] = [
  { value: 0, label: 'Không có', color: 'border-green-300 text-green-500' },
  { value: 1, label: 'Vài ngày', color: 'border-yellow-300 text-yellow-600' },
  { value: 2, label: 'Hơn nửa số ngày', color: 'border-orange-300 text-orange-500' },
  { value: 3, label: 'Gần như mỗi ngày', color: 'border-red-400 text-red-500' },
];

export const SEVERITY_4_SCALE_VI: RadioScaleOption[] = [
  { value: 0, label: 'Không bao giờ', color: 'border-green-300 text-green-500' },
  { value: 1, label: 'Thỉnh thoảng', color: 'border-yellow-300 text-yellow-600' },
  { value: 2, label: 'Thường xuyên', color: 'border-orange-300 text-orange-500' },
  { value: 3, label: 'Hầu như luôn luôn', color: 'border-red-400 text-red-500' },
];

export const PSS_5_SCALE_VI: RadioScaleOption[] = [
  { value: 0, label: 'Không bao giờ', color: 'border-green-300 text-green-500' },
  { value: 1, label: 'Hầu như không bao giờ', color: 'border-lime-300 text-lime-600' },
  { value: 2, label: 'Đôi khi', color: 'border-yellow-300 text-yellow-600' },
  { value: 3, label: 'Khá thường xuyên', color: 'border-orange-300 text-orange-500' },
  { value: 4, label: 'Rất thường xuyên', color: 'border-red-400 text-red-500' },
];
