
import { analyzeFullVIA } from '../lib/miso/engine';
// Don't import service statically to avoid singleton init crash
// import { aiConsultantService } from '../services/ai-consultant.service'; 
import { VIAPercentiles, Big5Percentiles, MisoAnalysisResult, UserInputData } from '../types/miso-v3';

// Mock Env beforehand
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.GOOGLE_GEMINI_API_KEY = 'mock-gemini-key';

async function verify() {
    console.log('🧪 Verifying VIA Analysis & AI Integration...\n');

    // Dynamic import after mocking env
    const { aiConsultantService, AIConsultantService } = await import('../services/ai-consultant.service');

    // 1. Verify analyzeFullVIA
    console.log('--- 1. VIA Analysis Verification ---');
    const mockViaPercentiles: Partial<VIAPercentiles> = {
        Hope: 95,
        Zest: 90,
        Gratitude: 85,
        Curiosity: 80,
        Love: 75,
        Prudence: 10,
        'Self-Regulation': 15,
    };

    const mockDass = { D: 10, A: 5, S: 15 };
    const mockBig5: Partial<Big5Percentiles> = { N: 60 };

    const viaResult = analyzeFullVIA(mockViaPercentiles, mockDass, mockBig5);

    console.log('Signature Strengths Count:', viaResult.signature_strengths.length);
    console.log('Top Strength:', viaResult.signature_strengths[0]?.name, '(', viaResult.signature_strengths[0]?.percentile, '%)');

    if (viaResult.signature_strengths.length === 5 && (viaResult.signature_strengths[0].name.includes('Hope') || viaResult.signature_strengths[0].name.includes('Hy vọng'))) {
        console.log('✅ VIA Analysis Logic Passed');
    } else {
        console.log('❌ VIA Analysis Logic Failed');
        console.log(viaResult.signature_strengths);
    }

    // 2. Verify AI Prompt
    console.log('\n--- 2. AI Prompt Verification ---');

    // Need to mimic ConsultationRequest['userProfile']
    const mockProfile: any = {
        big5Score: { domains: { O: 50, C: 50, E: 50, A: 50, N: 50 }, facets: {} as any },
        mbtiType: 'INFJ'
    };

    // Construct a partial MisoAnalysisResult
    const mockMisoAnalysis = {
        via_analysis: viaResult,
        scores: { BVS: 0.8, RCS: 0.4 },
        profile: { name: 'Resilient Architect', mechanism: 'Strategic coping', risk_level: 'LOW' },
        discrepancies: [
            { name: 'Hidden Stress', interpretation: 'You appear calm but are internally stressed.' }
        ],
        interventions: { immediate: [{ type: 'breathing_exercise' }] }
    } as unknown as MisoAnalysisResult;

    const prompt = aiConsultantService.buildUserPrompt(
        'stress',
        'I feel overwhelmed',
        mockProfile,
        mockMisoAnalysis
    );

    console.log('Prompt Snippet (Start):\n', prompt.slice(0, 200));
    console.log('...\nPrompt Snippet (VIA Section):\n');

    const viaIndex = prompt.indexOf('--- VIA CHARACTER STRENGTHS ---');
    if (viaIndex !== -1) {
        console.log(prompt.slice(viaIndex, viaIndex + 300));
    } else {
        console.log('VIA Section NOT FOUND');
    }

    const hasVIA = prompt.includes('--- VIA CHARACTER STRENGTHS ---');
    const hasSigStrength = prompt.includes('Hope') || prompt.includes('Hy vọng');
    const hasMBTI = prompt.includes('MBTI Type: INFJ');
    const hasMiso = prompt.includes('MISO V3 DEEP PSYCHOLOGICAL ANALYSIS');

    if (hasVIA && hasSigStrength && hasMBTI && hasMiso) {
        console.log('\n✅ AI Prompt Enrichment Passed');
    } else {
        console.log('\n❌ AI Prompt Enrichment Failed');
    }
}

verify();
