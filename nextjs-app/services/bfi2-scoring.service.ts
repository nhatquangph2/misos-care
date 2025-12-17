/**
 * BFI-2 Scoring Service
 * Xử lý tính điểm, reverse scoring, normalization và phân tích kết quả
 */

import {
  BFI2_ITEMS,
  BFI2_DOMAINS,
  BFI2_FACETS,
  BFI2_NORMS,
  type BFI2Response,
  type BFI2Score,
} from '@/constants/tests/bfi2-questions'

// ============================================
// REVERSE SCORING
// ============================================

/**
 * Đảo ngược điểm cho các item reverse-keyed
 * Công thức: new_score = 6 - old_score (với thang 1-5)
 */
function reverseScore(value: number): number {
  return 6 - value
}

/**
 * Xử lý reverse scoring cho tất cả các responses
 */
function processReverseScoring(responses: BFI2Response[]): Map<number, number> {
  const processedScores = new Map<number, number>()

  responses.forEach((response) => {
    const item = BFI2_ITEMS.find((i) => i.id === response.itemId)
    if (!item) return

    const score = item.reverse ? reverseScore(response.value) : response.value
    processedScores.set(response.itemId, score)
  })

  return processedScores
}

// ============================================
// FACET & DOMAIN SCORE CALCULATION
// ============================================

/**
 * Tính điểm trung bình cho một facet
 */
function calculateFacetScore(
  facetCode: string,
  domain: string,
  processedScores: Map<number, number>
): number {
  const facetItems = BFI2_ITEMS.filter(
    (item) => item.facet === facetCode && item.domain === domain
  )

  const scores: number[] = []
  facetItems.forEach((item) => {
    const score = processedScores.get(item.id)
    if (score !== undefined) {
      scores.push(score)
    }
  })

  if (scores.length === 0) return 0

  const sum = scores.reduce((acc, val) => acc + val, 0)
  return sum / scores.length
}

/**
 * Tính điểm trung bình cho một domain (từ 3 facets)
 */
function calculateDomainScore(
  domainCode: string,
  facetScores: { [key: string]: number }
): number {
  const domain = BFI2_DOMAINS.find((d) => d.code === domainCode)
  if (!domain) return 0

  const facetValues = domain.facets.map((facetCode) => facetScores[facetCode] || 0)
  const sum = facetValues.reduce((acc, val) => acc + val, 0)
  return sum / facetValues.length
}

// ============================================
// NORMALIZATION (Z-scores & T-scores)
// ============================================

/**
 * Tính Z-score
 * Z = (X - μ) / σ
 */
function calculateZScore(rawScore: number, mean: number, sd: number): number {
  if (sd === 0) return 0
  return (rawScore - mean) / sd
}

/**
 * Tính T-score
 * T = 50 + (10 × Z)
 */
function calculateTScore(zScore: number): number {
  return 50 + 10 * zScore
}

/**
 * Tính Percentile từ Z-score (xấp xỉ)
 * Sử dụng cumulative distribution function của phân phối chuẩn
 */
function zScoreToPercentile(z: number): number {
  // Xấp xỉ sử dụng hàm erf
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  let percentile = z > 0 ? 1 - p : p
  return Math.round(percentile * 100)
}

// ============================================
// DATA QUALITY CHECKS
// ============================================

interface DataQualityReport {
  isValid: boolean
  warnings: string[]
  completionTime?: number
  straightlining?: number
}

/**
 * Kiểm tra chất lượng dữ liệu
 */
export function checkDataQuality(
  responses: BFI2Response[],
  completionTimeSeconds?: number
): DataQualityReport {
  const warnings: string[] = []
  let isValid = true

  // 1. Kiểm tra đầy đủ
  if (responses.length < 60) {
    warnings.push(`Chỉ hoàn thành ${responses.length}/60 câu hỏi`)
    isValid = false
  }

  // 2. Kiểm tra thời gian (Speeding Check)
  if (completionTimeSeconds && completionTimeSeconds < 200) {
    warnings.push(
      `Thời gian hoàn thành quá nhanh (${completionTimeSeconds}s < 200s). Kết quả có thể không chính xác.`
    )
    isValid = false
  }

  // 3. Kiểm tra Straightlining (Pattern Detection)
  let maxStreak = 0
  let currentStreak = 1
  let prevValue = responses[0]?.value

  for (let i = 1; i < responses.length; i++) {
    if (responses[i].value === prevValue) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
    prevValue = responses[i].value
  }

  if (maxStreak > 10) {
    warnings.push(
      `Phát hiện trả lời theo mẫu: ${maxStreak} câu liên tiếp giống nhau. Kết quả có thể không đáng tin cậy.`
    )
    // Không set isValid = false vì có thể là hợp lệ, chỉ warning
  }

  // 4. Kiểm tra Consistency (cặp câu đối nghịch)
  // Ví dụ: Item 1 (Cởi mở, E+) vs Item 16 (Trầm lặng, E-)
  const consistencyPairs = [
    [1, 16], // Sociability
    [6, 36], // Assertiveness
    [41, 26], // Energy
  ]

  consistencyPairs.forEach(([id1, id2]) => {
    const r1 = responses.find((r) => r.itemId === id1)
    const r2 = responses.find((r) => r.itemId === id2)
    if (r1 && r2) {
      // Nếu cả 2 đều chọn cực cao (5) hoặc cả 2 đều chọn cực thấp (1), có vấn đề
      if (
        (r1.value === 5 && r2.value === 5) ||
        (r1.value === 1 && r2.value === 1)
      ) {
        warnings.push('Phát hiện câu trả lời mâu thuẫn. Vui lòng kiểm tra lại.')
      }
    }
  })

  return {
    isValid,
    warnings,
    completionTime: completionTimeSeconds,
    straightlining: maxStreak,
  }
}

// ============================================
// MAIN SCORING FUNCTION
// ============================================

/**
 * Tính toán điểm số BFI-2 hoàn chỉnh
 */
export function calculateBFI2Score(
  responses: BFI2Response[],
  completionTimeSeconds?: number
): {
  score: BFI2Score
  qualityReport: DataQualityReport
} {
  // 1. Kiểm tra chất lượng dữ liệu
  const qualityReport = checkDataQuality(responses, completionTimeSeconds)

  // 2. Xử lý reverse scoring
  const processedScores = processReverseScoring(responses)

  // 3. Tính điểm facets
  const facetScores: { [key: string]: number } = {}
  BFI2_FACETS.forEach((facet) => {
    facetScores[facet.code] = calculateFacetScore(
      facet.code,
      facet.domain,
      processedScores
    )
  })

  // 4. Tính điểm domains
  const domainScores = {
    E: calculateDomainScore('E', facetScores),
    A: calculateDomainScore('A', facetScores),
    C: calculateDomainScore('C', facetScores),
    N: calculateDomainScore('N', facetScores),
    O: calculateDomainScore('O', facetScores),
  }

  // 5. Tính T-scores cho domains
  const domainTScores = {
    E: calculateTScore(
      calculateZScore(domainScores.E, BFI2_NORMS.domains.E.mean, BFI2_NORMS.domains.E.sd)
    ),
    A: calculateTScore(
      calculateZScore(domainScores.A, BFI2_NORMS.domains.A.mean, BFI2_NORMS.domains.A.sd)
    ),
    C: calculateTScore(
      calculateZScore(domainScores.C, BFI2_NORMS.domains.C.mean, BFI2_NORMS.domains.C.sd)
    ),
    N: calculateTScore(
      calculateZScore(domainScores.N, BFI2_NORMS.domains.N.mean, BFI2_NORMS.domains.N.sd)
    ),
    O: calculateTScore(
      calculateZScore(domainScores.O, BFI2_NORMS.domains.O.mean, BFI2_NORMS.domains.O.sd)
    ),
  }

  // 6. Tính T-scores cho facets
  const facetTScores: { [key: string]: number } = {}
  Object.keys(facetScores).forEach((facetCode) => {
    const norm = BFI2_NORMS.facets[facetCode]
    if (norm) {
      const zScore = calculateZScore(facetScores[facetCode], norm.mean, norm.sd)
      facetTScores[facetCode] = calculateTScore(zScore)
    }
  })

  // 7. Tính percentiles cho domains
  const domainPercentiles = {
    E: zScoreToPercentile(
      calculateZScore(domainScores.E, BFI2_NORMS.domains.E.mean, BFI2_NORMS.domains.E.sd)
    ),
    A: zScoreToPercentile(
      calculateZScore(domainScores.A, BFI2_NORMS.domains.A.mean, BFI2_NORMS.domains.A.sd)
    ),
    C: zScoreToPercentile(
      calculateZScore(domainScores.C, BFI2_NORMS.domains.C.mean, BFI2_NORMS.domains.C.sd)
    ),
    N: zScoreToPercentile(
      calculateZScore(domainScores.N, BFI2_NORMS.domains.N.mean, BFI2_NORMS.domains.N.sd)
    ),
    O: zScoreToPercentile(
      calculateZScore(domainScores.O, BFI2_NORMS.domains.O.mean, BFI2_NORMS.domains.O.sd)
    ),
  }

  // 8. Calculate raw scores (sum of all items per domain) for MISO V3
  const rawScores = {
    N: 0,
    E: 0,
    O: 0,
    A: 0,
    C: 0,
  }

  // Sum up all processed scores by domain
  BFI2_ITEMS.forEach((item) => {
    const score = processedScores.get(item.id)
    if (score !== undefined) {
      rawScores[item.domain as keyof typeof rawScores] += score
    }
  })

  const score: BFI2Score = {
    domains: domainScores,
    facets: facetScores,
    tScores: {
      domains: domainTScores,
      facets: facetTScores,
    },
    percentiles: {
      domains: domainPercentiles,
    },
    raw_scores: rawScores,
  }

  return {
    score,
    qualityReport,
  }
}

// ============================================
// INTERPRETATION HELPERS
// ============================================

/**
 * Phân loại mức độ dựa trên T-score với giải thích chi tiết hơn
 */
export function interpretTScore(
  tScore: number,
  domain?: 'E' | 'A' | 'C' | 'N' | 'O'
): {
  level: 'very-low' | 'low' | 'average' | 'high' | 'very-high'
  label: string
  description: string
} {
  const isNegative = domain === 'N'

  if (tScore < 35) {
    return {
      level: 'very-low',
      label: 'Rất Thấp',
      description: isNegative
        ? 'Mức độ rất thấp - Rất ổn định cảm xúc, hiếm khi lo lắng hay buồn bã'
        : 'Mức độ rất thấp - Thấp hơn đáng kể so với mức trung bình của dân số',
    }
  } else if (tScore < 45) {
    return {
      level: 'low',
      label: 'Thấp',
      description: isNegative
        ? 'Mức độ thấp - Tương đối ổn định, ít bị ảnh hưởng bởi cảm xúc tiêu cực'
        : 'Mức độ thấp - Thấp hơn một chút so với mức trung bình',
    }
  } else if (tScore < 55) {
    return {
      level: 'average',
      label: 'Trung Bình',
      description: 'Mức độ trung bình - Nằm trong khoảng phổ biến của dân số',
    }
  } else if (tScore < 65) {
    return {
      level: 'high',
      label: 'Cao',
      description: isNegative
        ? 'Mức độ cao - Có xu hướng trải nghiệm lo âu, căng thẳng nhiều hơn'
        : 'Mức độ cao - Cao hơn một chút so với mức trung bình',
    }
  } else {
    return {
      level: 'very-high',
      label: 'Rất Cao',
      description: isNegative
        ? 'Mức độ rất cao - Thường xuyên trải nghiệm cảm xúc tiêu cực mạnh, cần chú ý chăm sóc'
        : 'Mức độ rất cao - Cao hơn đáng kể so với mức trung bình của dân số',
    }
  }
}

/**
 * Lấy màu sắc cho visualization dựa trên level và domain
 * Lưu ý: Domain N (Negative Emotionality) có màu ngược lại (cao = xấu)
 */
export function getLevelColor(
  level: 'very-low' | 'low' | 'average' | 'high' | 'very-high',
  domain?: 'E' | 'A' | 'C' | 'N' | 'O'
): string {
  // Đối với Negative Emotionality, đảo ngược màu sắc (cao = đỏ, thấp = xanh)
  const isNegative = domain === 'N'

  switch (level) {
    case 'very-low':
      return isNegative
        ? 'text-green-600 bg-green-50 border-green-200'  // N thấp = tốt
        : 'text-red-600 bg-red-50 border-red-200'        // Các domain khác: thấp = chưa tốt
    case 'low':
      return isNegative
        ? 'text-blue-600 bg-blue-50 border-blue-200'     // N thấp = tốt
        : 'text-orange-600 bg-orange-50 border-orange-200'
    case 'average':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'high':
      return isNegative
        ? 'text-orange-600 bg-orange-50 border-orange-200' // N cao = không tốt
        : 'text-blue-600 bg-blue-50 border-blue-200'       // Các domain khác: cao = tốt
    case 'very-high':
      return isNegative
        ? 'text-red-600 bg-red-50 border-red-200'          // N rất cao = xấu
        : 'text-green-600 bg-green-50 border-green-200'    // Các domain khác: rất cao = rất tốt
  }
}
