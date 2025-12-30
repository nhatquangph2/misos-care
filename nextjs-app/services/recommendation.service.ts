/**
 * Recommendation Service
 * Tích hợp Knowledge Base với MISO Analysis
 * 
 * Service này kết nối dữ liệu từ knowledge base (career, learning, sports, clinical)
 * vào MISO analysis để cung cấp recommendations cá nhân hóa cho người dùng.
 */

import { getComprehensiveRecommendations, type Big5Profile } from '@/constants/knowledge'
import { BIG5_DISORDER_MAPPINGS } from '@/constants/knowledge/clinical-psychology'
import type { MisoAnalysisResult } from '@/types/miso-v3'

// ============================================
// TYPES
// ============================================

export interface CareerRecommendation {
    hollandCode: string
    careers: Array<{
        title: string
        titleVi: string
        fitScore: number
        hollandCode: string
    }>
    source: string
}

export interface LearningRecommendation {
    techniques: Array<{
        id: string
        name: string
        nameVi: string
        effectSize: number
        effectivenessLevel: 'high' | 'moderate' | 'low'
        whyForYouVi: string
    }>
    studyTipsVi: string[]
    source: string
}

export interface SportsRecommendation {
    mentalToughnessScore: number
    dimensions: Array<{
        dimension: string
        score: number
        level: 'low' | 'moderate' | 'high'
    }>
    activities: Array<{
        name: string
        nameVi: string
        category: string
        mentalBenefitsVi: string[]
    }>
    source: string
}

export interface ClinicalInsights {
    riskFactors: Array<{
        disorder: string
        disorderVi: string
        probability: 'low' | 'moderate' | 'high'
        reasoning: string
        riskFactors: { trait: string; effect: string }[]
        treatments: string[]
    }>
    protectiveFactorsVi: string[]
    source: string
}

export interface PersonalizedRecommendations {
    career: CareerRecommendation | null
    learning: LearningRecommendation | null
    sports: SportsRecommendation | null
    clinical: ClinicalInsights | null
    generatedAt: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractBig5Profile(normalized: MisoAnalysisResult['normalized']): Big5Profile | null {
    if (!normalized?.big5) return null

    const big5 = normalized.big5
    return {
        O: typeof big5.O === 'number' ? big5.O : 50,
        C: typeof big5.C === 'number' ? big5.C : 50,
        E: typeof big5.E === 'number' ? big5.E : 50,
        A: typeof big5.A === 'number' ? big5.A : 50,
        N: typeof big5.N === 'number' ? big5.N : 50,
    }
}

function formatCareerRecommendation(
    careerData: ReturnType<typeof getComprehensiveRecommendations>['career']
): CareerRecommendation {
    return {
        hollandCode: careerData.hollandCode.code,
        careers: careerData.matchingCareers.slice(0, 5).map(c => ({
            title: c.title,
            titleVi: c.titleVi,
            fitScore: Math.round((c.hollandCode.split('').reduce((acc, code, i) => {
                const weight = [0.5, 0.3, 0.2][i] || 0
                const score = careerData.hollandCode.scores[code] || 50
                return acc + score * weight
            }, 0))),
            hollandCode: c.hollandCode,
        })),
        source: 'Holland (1997), Larson et al. (2002). DOI: 10.1006/jvbe.2001.1854',
    }
}

function formatLearningRecommendation(
    learningData: ReturnType<typeof getComprehensiveRecommendations>['learning'],
    big5: Big5Profile
): LearningRecommendation {
    const getWhyForYouVi = (techniqueId: string): string => {
        // Personalize based on Big5
        if (big5.C > 70 && techniqueId === 'distributed_practice') {
            return 'Tính kỷ luật cao giúp bạn dễ lên lịch học tập đều đặn'
        }
        if (big5.N > 60 && techniqueId === 'practice_testing') {
            return 'Kiểm tra thường xuyên giúp giảm lo âu bằng cách tạo sự chắc chắn về kiến thức'
        }
        if (big5.O > 70 && techniqueId === 'elaborative_interrogation') {
            return 'Sự tò mò tự nhiên giúp bạn dễ dàng đặt câu hỏi "tại sao" khi học'
        }
        if (big5.E > 70 && techniqueId === 'practice_testing') {
            return 'Bạn sẽ thích thử thách bản thân qua các bài kiểm tra'
        }
        if (big5.C < 40) {
            return 'Kỹ thuật này phù hợp vì không đòi hỏi kỷ luật cao'
        }
        return 'Phù hợp với phong cách học tập của bạn dựa trên tính cách'
    }

    return {
        techniques: learningData.recommendedTechniques.slice(0, 5).map(t => ({
            id: t.id,
            name: t.name,
            nameVi: t.nameVi,
            effectSize: t.effectSize ?? 0,
            effectivenessLevel: t.effectivenessLevel,
            whyForYouVi: getWhyForYouVi(t.id),
        })),
        studyTipsVi: learningData.personalizedAdvice.map(tip => {
            // Translate common tips
            if (tip.toLowerCase().includes('practice testing')) return 'Tập trung vào luyện tập kiểm tra thường xuyên'
            if (tip.toLowerCase().includes('spaced')) return 'Phân bố thời gian học đều đặn, tránh học dồn'
            if (tip.toLowerCase().includes('structure')) return 'Tạo cấu trúc và lịch học rõ ràng'
            if (tip.toLowerCase().includes('break')) return 'Chia nhỏ nội dung học thành từng phần'
            return tip
        }),
        source: 'Dunlosky et al. (2013). DOI: 10.1177/1529100612453266',
    }
}

function formatSportsRecommendation(
    sportsData: ReturnType<typeof getComprehensiveRecommendations>['sports']
): SportsRecommendation {
    const profile = sportsData.mentalToughnessProfile

    // Calculate average score from array of dimensions
    const avgScore = profile.reduce((acc, dim) => acc + dim.score, 0) / profile.length

    return {
        mentalToughnessScore: Math.round(avgScore),
        dimensions: profile.map(dim => ({
            dimension: dim.dimension,
            score: Math.round(dim.score),
            level: dim.level,
        })),
        activities: sportsData.recommendedSports.slice(0, 5).map(s => ({
            name: s.name,
            nameVi: s.nameVi,
            category: s.category,
            mentalBenefitsVi: s.mentalBenefits || ['Cải thiện sức khỏe tâm thần'],
        })),
        source: 'Jones et al. (2002). DOI: 10.1080/10413200290103509, Schuch et al. (2016). DOI: 10.1016/j.jpsychires.2016.02.023',
    }
}

function formatClinicalInsights(
    mentalHealthData: ReturnType<typeof getComprehensiveRecommendations>['mentalHealth'],
    big5: Big5Profile
): ClinicalInsights {
    const protectiveFactorsVi: string[] = []

    if (big5.E > 60) protectiveFactorsVi.push('Kết nối xã hội cao - giảm nguy cơ cô đơn')
    if (big5.C > 60) protectiveFactorsVi.push('Tính kỷ luật tốt - khả năng tự quản lý cao')
    if (big5.A > 60) protectiveFactorsVi.push('Hòa hợp giữa các cá nhân - ít xung đột')
    if (big5.N < 40) protectiveFactorsVi.push('Ổn định cảm xúc - ít phản ứng thái quá')
    if (big5.O > 60) protectiveFactorsVi.push('Cởi mở với trải nghiệm mới - linh hoạt thích ứng')

    const riskFactors: ClinicalInsights['riskFactors'] = []

    for (const mapping of BIG5_DISORDER_MAPPINGS) {
        let riskScore = 0
        const specificRisks: { trait: string; effect: string }[] = []

        // Calculate risk score based on Hedges' g effect sizes
        Object.entries(mapping.big5EffectSizes).forEach(([trait, effectSize]) => {
            const traitValue = big5[trait as keyof Big5Profile]
            if (typeof effectSize === 'number') {
                const zScore = (traitValue - 50) / 10
                if (Math.sign(zScore) === Math.sign(effectSize)) {
                    if (Math.abs(zScore) > 0.5) {
                        riskScore += Math.abs(effectSize) * Math.abs(zScore)
                        if (Math.abs(effectSize) > 0.3) {
                            specificRisks.push({
                                trait,
                                effect: effectSize > 0 ? 'Cao' : 'Thấp'
                            })
                        }
                    }
                } else if (Math.abs(zScore) > 1 && Math.abs(effectSize) > 0.5) {
                    protectiveFactorsVi.push(`${trait === 'N' ? 'Ít lo âu' : trait === 'C' ? 'Có kỷ luật' : trait === 'E' ? 'Hòa đồng' : trait} giúp giảm nguy cơ ${mapping.disorderVi}`)
                }
            }
        })

        const probability = riskScore > 2.5 ? 'high' : riskScore > 1.5 ? 'moderate' : 'low'

        if (probability !== 'low') {
            const treatments = [
                ...(mapping.treatmentEffectSizes.cbt ? ['Liệu pháp nhận thức hành vi (CBT)'] : []),
                ...(mapping.treatmentEffectSizes.medication ? ['Thuốc (theo chỉ định)'] : []),
                ...(mapping.treatmentEffectSizes.combined ? ['Kết hợp thuốc & tâm lý trị liệu'] : []),
                ...(mapping.treatmentEffectSizes.other?.map((o: { name: string }) => o.name) || [])
            ]

            riskFactors.push({
                disorder: mapping.disorder,
                disorderVi: mapping.disorderVi,
                probability,
                reasoning: `Dựa trên mối liên hệ với ${specificRisks.map(r => r.trait).join(', ')}`,
                riskFactors: specificRisks,
                treatments
            })
        }
    }

    return {
        riskFactors: riskFactors.sort((a, b) => (
            (a.probability === 'high' ? 3 : 2) - (b.probability === 'high' ? 3 : 2)
        )),
        protectiveFactorsVi: Array.from(new Set(protectiveFactorsVi)).slice(0, 5),
        source: 'Kotov et al. (2010). DOI: 10.1037/a0020327',
    }
}

// ============================================
// MAIN SERVICE
// ============================================

export function getPersonalizedRecommendations(
    misoAnalysis: MisoAnalysisResult
): PersonalizedRecommendations {
    const big5 = extractBig5Profile(misoAnalysis.normalized)

    if (!big5) {
        return {
            career: null,
            learning: null,
            sports: null,
            clinical: null,
            generatedAt: new Date().toISOString(),
        }
    }

    try {
        const comprehensive = getComprehensiveRecommendations(big5)

        return {
            career: formatCareerRecommendation(comprehensive.career),
            learning: formatLearningRecommendation(comprehensive.learning, big5),
            sports: formatSportsRecommendation(comprehensive.sports),
            clinical: formatClinicalInsights(comprehensive.mentalHealth, big5),
            generatedAt: new Date().toISOString(),
        }
    } catch (error) {
        console.error('Error generating recommendations:', error)
        return {
            career: null,
            learning: null,
            sports: null,
            clinical: null,
            generatedAt: new Date().toISOString(),
        }
    }
}

// ============================================
// AI PROMPT CONTEXT BUILDER (Vietnamese)
// ============================================

export function buildKnowledgeContextForAI(big5: Big5Profile): string {
    try {
        const recommendations = getComprehensiveRecommendations(big5)

        let context = `\n--- BỐI CẢNH NGHIÊN CỨU HỌC THUẬT ---\n`

        // Career
        context += `\n📊 ĐỊNH HƯỚNG NGHỀ NGHIỆP (Holland RIASEC, Larson 2002):\n`
        context += `- Mã Holland: ${recommendations.career.hollandCode.code}\n`
        context += `- Top nghề phù hợp: ${recommendations.career.matchingCareers.slice(0, 3).map(c => c.titleVi).join(', ')}\n`

        // Clinical
        context += `\n⚕️ YẾU TỐ RỦI RO SỨC KHỎE TÂM THẦN (Kotov et al., 2010):\n`
        recommendations.mentalHealth.riskScreening.forEach(r => {
            const probVi = r.probability === 'high' ? 'Cao' : r.probability === 'moderate' ? 'Trung bình' : 'Thấp'
            context += `- ${r.disorder.disorderVi}: Xác suất ${probVi}\n`
        })

        // Learning
        context += `\n📚 PHƯƠNG PHÁP HỌC TẬP HIỆU QUẢ (Dunlosky et al., 2013):\n`
        context += `- Kỹ thuật tốt nhất: ${recommendations.learning.recommendedTechniques.slice(0, 3).map(t => t.nameVi).join(', ')}\n`

        // Sports
        context += `\n🏃 VẬN ĐỘNG & SỨC KHỎE TÂM THẦN (Schuch 2016):\n`
        const mtProfile = recommendations.sports.mentalToughnessProfile
        const controlDim = mtProfile.find(d => d.dimension === 'control')
        const challengeDim = mtProfile.find(d => d.dimension === 'challenge')
        context += `- Điểm Mental Toughness: Control=${controlDim?.score || 'N/A'}, Challenge=${challengeDim?.score || 'N/A'}\n`
        context += `- Hoạt động phù hợp: ${recommendations.sports.recommendedSports.slice(0, 3).map(s => s.nameVi).join(', ')}\n`

        context += `--- KẾT THÚC BỐI CẢNH NGHIÊN CỨU ---\n\n`

        return context
    } catch (error) {
        console.error('Error building knowledge context:', error)
        return ''
    }
}

// ============================================
// EXPORTS
// ============================================

export const recommendationService = {
    getPersonalizedRecommendations,
    buildKnowledgeContextForAI,
}

export default recommendationService
