
import { BaseService } from './base.service';
import {
  BFI2_ITEMS,
  BFI2_DOMAINS,
  BFI2_FACETS,
  BFI2_NORMS,
  type BFI2Response,
  type BFI2Score,
} from '@/constants/tests/bfi2-questions';

export interface DataQualityReport {
  isValid: boolean;
  warnings: string[];
  completionTime?: number;
  straightlining?: number;
}

export class BFIScoringService extends BaseService {
  // ============================================
  // REVERSE SCORING
  // ============================================

  reverseScore(value: number): number {
    return 6 - value;
  }

  processReverseScoring(responses: BFI2Response[]): Map<number, number> {
    const processedScores = new Map<number, number>();
    responses.forEach((response) => {
      const item = BFI2_ITEMS.find((i) => i.id === response.itemId);
      if (!item) return;
      const score = item.reverse ? this.reverseScore(response.value) : response.value;
      processedScores.set(response.itemId, score);
    });
    return processedScores;
  }

  // ============================================
  // FACET & DOMAIN SCORE CALCULATION
  // ============================================

  calculateFacetScore(facetCode: string, domain: string, processedScores: Map<number, number>): number {
    const facetItems = BFI2_ITEMS.filter((item) => item.facet === facetCode && item.domain === domain);
    const scores: number[] = [];
    facetItems.forEach((item) => {
      const score = processedScores.get(item.id);
      if (score !== undefined) scores.push(score);
    });
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, val) => acc + val, 0);
    return sum / scores.length;
  }

  calculateDomainScore(domainCode: string, facetScores: { [key: string]: number }): number {
    const domain = BFI2_DOMAINS.find((d) => d.code === domainCode);
    if (!domain) return 0;
    const facetValues = domain.facets.map((facetCode) => facetScores[facetCode] || 0);
    const sum = facetValues.reduce((acc, val) => acc + val, 0);
    return sum / facetValues.length;
  }

  // ============================================
  // NORMALIZATION (Z-scores & T-scores)
  // ============================================

  calculateZScore(rawScore: number, mean: number, sd: number): number {
    if (sd === 0) return 0;
    return (rawScore - mean) / sd;
  }

  calculateTScore(zScore: number): number {
    return 50 + 10 * zScore;
  }

  zScoreToPercentile(z: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    let percentile = z > 0 ? 1 - p : p;
    return Math.round(percentile * 100);
  }

  // ============================================
  // DATA QUALITY CHECKS
  // ============================================

  checkDataQuality(responses: BFI2Response[], completionTimeSeconds?: number): DataQualityReport {
    const warnings: string[] = [];
    let isValid = true;

    if (responses.length < 60) {
      warnings.push(`Chỉ hoàn thành ${responses.length}/60 câu hỏi`);
      isValid = false;
    }

    if (completionTimeSeconds && completionTimeSeconds < 200) {
      warnings.push(`Thời gian hoàn thành quá nhanh (${completionTimeSeconds}s < 200s). Kết quả có thể không chính xác.`);
      isValid = false;
    }

    let maxStreak = 0;
    let currentStreak = 1;
    let prevValue = responses[0]?.value;

    for (let i = 1; i < responses.length; i++) {
      if (responses[i].value === prevValue) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
      prevValue = responses[i].value;
    }

    if (maxStreak > 10) {
      warnings.push(`Phát hiện trả lời theo mẫu: ${maxStreak} câu liên tiếp giống nhau. Kết quả có thể không đáng tin cậy.`);
    }

    const consistencyPairs = [[1, 16], [6, 36], [41, 26]];
    consistencyPairs.forEach(([id1, id2]) => {
      const r1 = responses.find((r) => r.itemId === id1);
      const r2 = responses.find((r) => r.itemId === id2);
      if (r1 && r2 && ((r1.value === 5 && r2.value === 5) || (r1.value === 1 && r2.value === 1))) {
        warnings.push('Phát hiện câu trả lời mâu thuẫn. Vui lòng kiểm tra lại.');
      }
    });

    return { isValid, warnings, completionTime: completionTimeSeconds, straightlining: maxStreak };
  }

  // ============================================
  // MAIN SCORING FUNCTION
  // ============================================

  calculateBFI2Score(responses: BFI2Response[], completionTimeSeconds?: number): { score: BFI2Score; qualityReport: DataQualityReport } {
    const qualityReport = this.checkDataQuality(responses, completionTimeSeconds);
    const processedScores = this.processReverseScoring(responses);
    const facetScores: { [key: string]: number } = {};
    BFI2_FACETS.forEach((facet) => {
      facetScores[facet.code] = this.calculateFacetScore(facet.code, facet.domain, processedScores);
    });

    const domainScores = {
      E: this.calculateDomainScore('E', facetScores),
      A: this.calculateDomainScore('A', facetScores),
      C: this.calculateDomainScore('C', facetScores),
      N: this.calculateDomainScore('N', facetScores),
      O: this.calculateDomainScore('O', facetScores),
    };

    const domainTScores = {
      E: this.calculateTScore(this.calculateZScore(domainScores.E, BFI2_NORMS.domains.E.mean, BFI2_NORMS.domains.E.sd)),
      A: this.calculateTScore(this.calculateZScore(domainScores.A, BFI2_NORMS.domains.A.mean, BFI2_NORMS.domains.A.sd)),
      C: this.calculateTScore(this.calculateZScore(domainScores.C, BFI2_NORMS.domains.C.mean, BFI2_NORMS.domains.C.sd)),
      N: this.calculateTScore(this.calculateZScore(domainScores.N, BFI2_NORMS.domains.N.mean, BFI2_NORMS.domains.N.sd)),
      O: this.calculateTScore(this.calculateZScore(domainScores.O, BFI2_NORMS.domains.O.mean, BFI2_NORMS.domains.O.sd)),
    };

    const facetTScores: { [key: string]: number } = {};
    Object.keys(facetScores).forEach((facetCode) => {
      const norm = BFI2_NORMS.facets[facetCode];
      if (norm) {
        facetTScores[facetCode] = this.calculateTScore(this.calculateZScore(facetScores[facetCode], norm.mean, norm.sd));
      }
    });

    const domainPercentiles = {
      E: this.zScoreToPercentile(this.calculateZScore(domainScores.E, BFI2_NORMS.domains.E.mean, BFI2_NORMS.domains.E.sd)),
      A: this.zScoreToPercentile(this.calculateZScore(domainScores.A, BFI2_NORMS.domains.A.mean, BFI2_NORMS.domains.A.sd)),
      C: this.zScoreToPercentile(this.calculateZScore(domainScores.C, BFI2_NORMS.domains.C.mean, BFI2_NORMS.domains.C.sd)),
      N: this.zScoreToPercentile(this.calculateZScore(domainScores.N, BFI2_NORMS.domains.N.mean, BFI2_NORMS.domains.N.sd)),
      O: this.zScoreToPercentile(this.calculateZScore(domainScores.O, BFI2_NORMS.domains.O.mean, BFI2_NORMS.domains.O.sd)),
    };

    const score: BFI2Score = {
      domains: domainScores,
      facets: facetScores,
      tScores: { domains: domainTScores, facets: facetTScores },
      percentiles: { domains: domainPercentiles },
      raw_scores: { ...domainScores },
    };

    return { score, qualityReport };
  }

  interpretTScore(tScore: number, domain?: 'E' | 'A' | 'C' | 'N' | 'O'): { level: 'very-low' | 'low' | 'average' | 'high' | 'very-high'; label: string; description: string } {
    const isNegative = domain === 'N';
    if (tScore < 35) {
      return { level: 'very-low', label: 'Rất Thấp', description: isNegative ? 'Mức độ rất thấp - Rất ổn định cảm xúc, hiếm khi lo lắng hay buồn bã' : 'Mức độ rất thấp - Thấp hơn đáng kể so với mức trung bình của dân số' };
    } else if (tScore < 45) {
      return { level: 'low', label: 'Thấp', description: isNegative ? 'Mức độ thấp - Tương đối ổn định, ít bị ảnh hưởng bởi cảm xúc tiêu cực' : 'Mức độ thấp - Thấp hơn một chút so với mức trung bình' };
    } else if (tScore < 55) {
      return { level: 'average', label: 'Trung Bình', description: 'Mức độ trung bình - Nằm trong khoảng phổ biến của dân số' };
    } else if (tScore < 65) {
      return { level: 'high', label: 'Cao', description: isNegative ? 'Mức độ cao - Có xu hướng trải nghiệm lo âu, căng thẳng nhiều hơn' : 'Mức độ cao - Cao hơn một chút so với mức trung bình' };
    } else {
      return { level: 'very-high', label: 'Rất Cao', description: isNegative ? 'Mức độ rất cao - Thường xuyên trải nghiệm cảm xúc tiêu cực mạnh, cần chú ý chăm sóc' : 'Mức độ rất cao - Cao hơn đáng kể so với mức trung bình của dân số' };
    }
  }

  getLevelColor(level: 'very-low' | 'low' | 'average' | 'high' | 'very-high', domain?: 'E' | 'A' | 'C' | 'N' | 'O'): string {
    const isNegative = domain === 'N';
    switch (level) {
      case 'very-low': return isNegative ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
      case 'low': return isNegative ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-orange-600 bg-orange-50 border-orange-200';
      case 'average': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'high': return isNegative ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'very-high': return isNegative ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200';
    }
  }
}

export const bfiScoringService = new BFIScoringService();

export const calculateBFI2Score = (r: BFI2Response[], t?: number) => bfiScoringService.calculateBFI2Score(r, t);
export const checkDataQuality = (r: BFI2Response[], t?: number) => bfiScoringService.checkDataQuality(r, t);
export const interpretTScore = (t: number, d?: any) => bfiScoringService.interpretTScore(t, d);
export const getLevelColor = (l: any, d?: any) => bfiScoringService.getLevelColor(l, d);
