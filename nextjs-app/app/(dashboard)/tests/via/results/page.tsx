/**
 * VIA Character Strengths Results Page
 * Display user's signature strengths and personalized recommendations
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { VIAResult } from '@/services/via-scoring.service'

export default function VIAResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<VIAResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load result from localStorage
    const storedResult = localStorage.getItem('via_result')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      // No result found, redirect back to test
      router.push('/tests/via')
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const { signatureStrengths, virtueScores, overallProfile } = result

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Điểm Mạnh Đặc Trưng Của Bạn
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {overallProfile}
          </p>
        </div>

        {/* Signature Strengths (Top 5) */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            🌟 5 Điểm Mạnh Nổi Bật Nhất
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {signatureStrengths.map((strength, index) => (
              <div
                key={strength.strength}
                className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{strength.icon}</span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">
                    #{strength.rank}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${strength.color}`}>
                  {strength.strengthName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {strength.virtueName}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Mức độ</span>
                    <span className="font-semibold">{strength.percentageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${strength.percentageScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    💡 <strong>Lời khuyên:</strong> {strength.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Virtue Scores */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            6 Đức Tính Cốt Lõi
          </h2>
          <div className="glass-card p-6 rounded-2xl">
            <div className="space-y-4">
              {virtueScores.map((virtue) => (
                <div key={virtue.virtue}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {virtue.virtueName}
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {virtue.percentageScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${virtue.percentageScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Strengths Ranking */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            Thứ Hạng Đầy Đủ (24 Điểm Mạnh)
          </h2>
          <div className="glass-card p-6 rounded-2xl">
            <div className="grid gap-3 md:grid-cols-2">
              {result.strengthScores.map((strength) => (
                <div
                  key={strength.strength}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    strength.isSignature
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{strength.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{strength.strengthName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {strength.virtueName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">#{strength.rank}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {strength.percentageScore}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/profile')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Xem Hồ Sơ Của Tôi
          </button>
          <button
            onClick={() => router.push('/tests')}
            className="px-8 py-3 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:shadow-lg transition-all"
          >
            Làm Thêm Bài Test
          </button>
          <button
            onClick={() => {
              const resultText = `VIA Character Strengths Results\n\nTop 5 Strengths:\n${signatureStrengths
                .map((s, i) => `${i + 1}. ${s.strengthName} (${s.percentageScore}%)`)
                .join('\n')}`
              navigator.clipboard.writeText(resultText)
              alert('Đã sao chép kết quả!')
            }}
            className="px-8 py-3 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:shadow-lg transition-all"
          >
            📋 Sao chép Kết quả
          </button>
        </div>

        {/* Educational Info */}
        <div className="mt-12 glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
          <h3 className="font-bold text-lg mb-3">📚 Hiểu Về Điểm Mạnh Của Bạn</h3>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>
              <strong>Điểm Mạnh Đặc Trưng (Signature Strengths):</strong> Là 5 điểm mạnh
              nổi bật nhất, đại diện cho bản chất cốt lõi của bạn. Hãy tìm cách sử dụng
              chúng mỗi ngày.
            </p>
            <p>
              <strong>Cách Phát Triển:</strong> Đọc kỹ "Lời khuyên" cho từng điểm mạnh và
              thực hành đều đặn. Nghiên cứu cho thấy việc sử dụng điểm mạnh giúp tăng
              hạnh phúc và thành công.
            </p>
            <p>
              <strong>Không Có Điểm Yếu:</strong> Các điểm mạnh xếp thứ hạng thấp không
              phải là "điểm yếu" - chúng chỉ đơn giản là không phải đặc điểm nổi bật của
              bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
