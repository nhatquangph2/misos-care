import { GoogleGenerativeAI } from '@google/generative-ai';
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseService } from './base.service';
import { BFI2Score } from '@/constants/tests/bfi2-questions';
import { Database } from '@/types/database';
import * as Prompts from '@/config/ai-prompts';

export interface ConsultationResponse {
  situationAnalysis: string;
  rootCauses: string[];
  evidenceBasedSolution: {
    primaryApproach: string;
    researchBacking: string;
    whyThisApproach: string;
  };
  actionSteps: Array<{
    step: number;
    action: string;
    timeframe: string;
    measurableOutcome: string;
  }>;
  expectedOutcome: string;
  whenToSeekProfessional: string[];
  resources: Array<{
    title: string;
    link: string;
    type: 'article' | 'book' | 'video' | 'app';
    description?: string;
  }>;
}

import { MisoAnalysisResult } from '@/types/miso-v3';

export interface ConsultationRequest {
  userProfile: {
    big5Score: BFI2Score;
    mbtiType?: string;
    viaStrengths?: string[];
  };
  issue: 'stress' | 'anxiety' | 'depression' | 'procrastination' | 'relationships' | 'general';
  specificSituation: string;
  misoAnalysis?: MisoAnalysisResult; // MISO V3 deep analysis
}

export class AIConsultantService extends BaseService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(supabase?: SupabaseClient<Database>) {
    super(supabase);
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Main entry point for AI consultation
   */
  async getConsultation(request: ConsultationRequest): Promise<ConsultationResponse> {
    try {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('GOOGLE_GEMINI_API_KEY not configured');

      if (!this.genAI) {
        this.genAI = new GoogleGenerativeAI(apiKey);
      }

      const { issue, specificSituation, userProfile, misoAnalysis } = request;
      const systemPrompt = this.determineSystemPrompt(issue);
      const userPrompt = this.buildUserPrompt(issue, specificSituation, userProfile, misoAnalysis);

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(userPrompt);
      let responseText = result.response.text();

      // Cleanup markdown if present (even with JSON mode sometimes models wrap it)
      responseText = responseText.replace(/```json\n/g, '').replace(/```/g, '').trim();

      // Find JSON object if there's extra text
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1) {
        responseText = responseText.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(responseText);

      // Robust normalization to prevent "map is not a function" errors
      const ensureArray = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          if (val.includes(',') || val.includes('\n')) {
            return val.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
          }
          return [val];
        }
        return [];
      };

      const normalized: ConsultationResponse = {
        situationAnalysis: parsed.situationAnalysis || parsed.Phân_tích_tình_huống || '',
        rootCauses: ensureArray(parsed.rootCauses || parsed.Nguyên_nhân_gốc_rễ),
        evidenceBasedSolution: {
          primaryApproach: parsed.evidenceBasedSolution?.primaryApproach || '',
          researchBacking: parsed.evidenceBasedSolution?.researchBacking || '',
          whyThisApproach: parsed.evidenceBasedSolution?.whyThisApproach || '',
        },
        actionSteps: Array.isArray(parsed.actionSteps) ? parsed.actionSteps : [],
        expectedOutcome: parsed.expectedOutcome || parsed.Kết_quả_kỳ_vọng || '',
        whenToSeekProfessional: ensureArray(parsed.whenToSeekProfessional || parsed.Khi_nào_cần_gặp_chuyên_gia),
        resources: Array.isArray(parsed.resources) ? parsed.resources : [],
      };

      // Final safety check for required arrays
      if (normalized.rootCauses.length === 0) normalized.rootCauses = ['Cần phân tích thêm'];
      if (normalized.whenToSeekProfessional.length === 0) normalized.whenToSeekProfessional = ['Nếu triệu chứng trở nên nghiêm trọng, hãy liên hệ chuyên gia y tế ngay lập tức'];

      return normalized;
    } catch (error) {
      // If JSON parse fails, try to repair or just invalid
      console.error('AI JSON Parse Error:', error);
      // We could try a "json-repair" library here if available, but for now fallback
      console.error('AI Consultation Error:', error);
      return this.getFallbackResponse(error);
    }
  }

  private determineSystemPrompt(issue: string): string {
    const issueLower = issue.toLowerCase();
    if (issueLower.includes('stress') || issueLower.includes('burnout')) {
      return Prompts.STRESS_BURNOUT_SYSTEM_PROMPT;
    }
    if (issueLower.includes('anxiety') || issueLower.includes('lo âu')) {
      return Prompts.ANXIETY_SYSTEM_PROMPT;
    }
    return Prompts.BASE_SYSTEM_PROMPT;
  }

  public buildUserPrompt(issue: string, context: string, profile: ConsultationRequest['userProfile'], misoAnalysis?: MisoAnalysisResult): string {
    let prompt = `ISSUE: ${issue}\nSITUATION: ${context}\n\n`;

    // 1. Basic Profile
    if (profile.big5Score) {
      const { domains } = profile.big5Score;
      prompt += `PERSONALITY PROFILE (Big Five):\n` +
        `- Openness: ${domains.O}/100\n` +
        `- Conscientiousness: ${domains.C}/100\n` +
        `- Extraversion: ${domains.E}/100\n` +
        `- Agreeableness: ${domains.A}/100\n` +
        `- Neuroticism: ${domains.N}/100\n\n`;
    }

    if (profile.mbtiType) {
      prompt += `MBTI Type: ${profile.mbtiType}\n`;
      // We could add MBTI specific descriptions here if we had a mapping
    }

    // VIA STRENGTHS
    if (misoAnalysis?.via_analysis) {
      const via = misoAnalysis.via_analysis;
      prompt += `\n--- VIA CHARACTER STRENGTHS ---\n`;

      if (via.signature_strengths && via.signature_strengths.length > 0) {
        prompt += `Signature Strengths (Top 5):\n`;
        via.signature_strengths.forEach(s => {
          prompt += `- ${s.name} (${s.strength}): ${s.percentile}%\n`;
        });
      }

      if (via.weaknesses && via.weaknesses.length > 0) {
        prompt += `Lesser Strengths (Bottom 5): ${via.weaknesses.map(s => s.name).join(', ')}\n`;
      }

      if (via.virtue_profile && via.virtue_profile.length > 0) {
        const topVirtue = via.virtue_profile[0];
        prompt += `Dominant Virtue: ${topVirtue.name} (Avg: ${topVirtue.score}%)\n`;
      }
    } else if (profile.viaStrengths && profile.viaStrengths.length > 0) {
      // Fallback if full analysis not available
      prompt += `Signature Strengths: ${profile.viaStrengths.join(', ')}\n`;
    }

    // 2. MISO V3 Advanced Analysis (Priority)
    if (misoAnalysis) {
      prompt += `\n--- MISO V3 DEEP PSYCHOLOGICAL ANALYSIS ---\n`;

      // Profile
      if (misoAnalysis.profile && 'name' in misoAnalysis.profile) {
        prompt += `Core Profile: ${misoAnalysis.profile.name}\n`;
        prompt += `Mechanism: ${misoAnalysis.profile.mechanism}\n`;
        prompt += `Risk Level: ${misoAnalysis.profile.risk_level}\n`;
      }

      // Scores
      if (misoAnalysis.scores) {
        prompt += `Vulnerability (BVS): ${misoAnalysis.scores.BVS.toFixed(2)} (High > 0.5 means prone to stress)\n`;
        prompt += `Resilience (RCS): ${misoAnalysis.scores.RCS.toFixed(2)} (High > 0.5 means strong recovery)\n`;
      }

      // Discrepancies
      if (misoAnalysis.discrepancies && misoAnalysis.discrepancies.length > 0) {
        prompt += `\nDetected Psychological Discrepancies (Hidden Risks):\n`;
        misoAnalysis.discrepancies.forEach(d => {
          prompt += `- ${d.name}: ${d.interpretation}\n`;
        });
      }

      // 3. Causal Mechanisms & Compensations
      if (misoAnalysis.mechanisms) {
        const { active, compensations } = misoAnalysis.mechanisms;
        if (active && active.length > 0) {
          prompt += `\nActive Causal Pathways (Personality → Stress):\n`;
          active.forEach(m => {
            prompt += `- ${m.pathway} (Strength: ${Math.round(m.strength * 100)}%)\n`;
          });
        }
        if (compensations && compensations.length > 0) {
          prompt += `\nActive VIA Compensations (Buffers):\n`;
          compensations.forEach(c => {
            prompt += `- ${c.mechanism} (Using ${c.condition})\n`;
          });
        }
      }

      // VIA Specific Interpretation from MISO
      if (misoAnalysis.via_analysis) {
        if (misoAnalysis.via_analysis.interpretation) {
          prompt += `\nCharacter Strength Insights: ${misoAnalysis.via_analysis.interpretation}\n`;
        }
        if (misoAnalysis.via_analysis.build_strengths.length > 0) {
          prompt += `Recommended Strengths to Build: ${misoAnalysis.via_analysis.build_strengths.map(b => b.strength).join(', ')}\n`;
        }
      }

      // Recommended Interventions
      if (misoAnalysis.interventions && 'immediate' in misoAnalysis.interventions) {
        prompt += `\nScientifically Recommended Interventions:\n`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const interventions = misoAnalysis.interventions as any;
        const immediate = interventions.immediate || [];
        const shortTerm = interventions.short_term || [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [...immediate, ...shortTerm].slice(0, 3).forEach((i: any) => {
          prompt += `- ${i.type.replace(/_/g, ' ')}\n`;
        });
      }
      prompt += `-------------------------------------------\n`;
    }

    prompt += `\nPlease provide a detailed consultation in JSON format with the following keys: situationAnalysis, rootCauses, evidenceBasedSolution, actionSteps, expectedOutcome, whenToSeekProfessional, resources.
    IMPORTANT: ALL content in the JSON values must be in Vietnamese. DO NOT use English except for technical terms in parentheses if necessary.

    !!! CRITICAL PERSONALIZATION INSTRUCTIONS !!!
    1. PERFORM CROSS-SYNTHESIS: Compare their Big 5 Traits vs Current Distress.
       - If Trait is Low (e.g., Low N) but Distress is High => Situational Stress.
       - If Trait is High (e.g., High N) and Distress is High => Trait Vulnerability.
       - EXPLAIN THIS LINK in "situationAnalysis".
    2. APPLY STRENGTHS: You MUST pick 1-2 VIA Strengths from the list above and incorporate them into the "evidenceBasedSolution".
    3. THE 'WHY' CLAUSE: In "evidenceBasedSolution", you MUST append "(Phù hợp với bạn vì...)" explaining why this fits their profile.`;

    // Custom instructions based on MISO
    if (misoAnalysis) {
      prompt += `\nLƯU Ý: Đã có phân tích MISO V3. Hãy sử dụng dữ liệu về "Discrepancies" và "Active Causal Pathways" ở trên. Nếu họ có Discrepancy "[Name]", hãy đề cập trực tiếp đến nó.`;
    }

    return prompt;
  }

  getQuickRecommendations(
    big5Score: BFI2Score,
    issue: 'stress' | 'anxiety' | 'depression' | 'procrastination'
  ): string[] {
    const recommendations: string[] = [];
    const domains = big5Score.domains;

    if (issue === 'stress') {
      recommendations.push('🎯 XÁC ĐỊNH NGUỒN GỐC: Liệt kê các tác nhân gây căng thẳng hàng đầu.');
      if (domains.C < 40) recommendations.push('📅 CẤU TRÚC: Xây dựng một lịch trình vi mô (micro-schedule).');
    } else if (issue === 'anxiety') {
      recommendations.push('📝 NHẬT KÝ LO ÂU: Phân loại lo lắng thực tế và lo lắng giả định.');
    }
    return recommendations;
  }

  private getFallbackResponse(error: unknown): ConsultationResponse {
    return {
      situationAnalysis: `Lỗi kết nối AI: ${error instanceof Error ? error.message : 'Unknown'}.`,
      rootCauses: ['Chưa thể phân tích do lỗi kỹ thuật'],
      evidenceBasedSolution: {
        primaryApproach: 'Vui lòng thử lại sau',
        researchBacking: 'N/A',
        whyThisApproach: 'Fallback',
      },
      actionSteps: [{ step: 1, action: 'Thử lại sau', timeframe: 'Ngay', measurableOutcome: 'Kết nối lại' }],
      expectedOutcome: 'Hệ thống khôi phục',
      whenToSeekProfessional: ['Nếu khẩn cấp, liên hệ chuyên gia ngay'],
      resources: [],
    };
  }
}

export const aiConsultantService = new AIConsultantService();
export const getAIConsultation = (request: ConsultationRequest) => aiConsultantService.getConsultation(request);
export const getQuickRecommendations = (b: BFI2Score, i: 'stress' | 'anxiety' | 'depression' | 'procrastination') => aiConsultantService.getQuickRecommendations(b, i);
export const SYSTEM_PROMPTS = Prompts;
