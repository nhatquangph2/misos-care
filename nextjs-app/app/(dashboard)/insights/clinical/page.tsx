import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import {
    getTransdiagnosticRecommendations,
    getDASSSeverityRecommendations,
    type TransdiagnosticRecommendation,
    type DASSSeverityRecommendation
} from '@/services/enhanced-intervention.service'
import Link from 'next/link'
import { ArrowLeft, Heart, Shield, AlertTriangle, CheckCircle, Brain, Activity, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Sức khỏe Tâm thần | MISO Care',
    description: 'Phân tích yếu tố rủi ro và bảo vệ sức khỏe tâm thần dựa trên Kotov et al. (2010)',
}

async function getClinicalData(userId: string) {
    const supabase = await createClient()

    // Get user's personality profile with correct column names
    const { data: profile } = await supabase
        .from('personality_profiles')
        .select('big5_openness, big5_conscientiousness, big5_extraversion, big5_agreeableness, big5_neuroticism, mbti_type')
        .eq('user_id', userId)
        .single()

    // Get DASS scores from mental_health_records
    const { data: dassRecord } = await supabase
        .from('mental_health_records')
        .select('subscale_scores')
        .eq('user_id', userId)
        .eq('test_type', 'DASS21')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (!profile?.big5_openness) return null

    const big5_raw = {
        O: profile.big5_openness || 0,
        C: profile.big5_conscientiousness || 0,
        E: profile.big5_extraversion || 0,
        A: profile.big5_agreeableness || 0,
        N: profile.big5_neuroticism || 0,
    }

    const misoResult = await runMisoAnalysis({
        big5_raw,
        mbti: profile.mbti_type || undefined,
    }, userId)

    const recommendations = getPersonalizedRecommendations(misoResult)

    // Get enhanced insights
    const transdiagnostic = getTransdiagnosticRecommendations(big5_raw)

    // Get DASS severity if scores available
    let dassSeverity: DASSSeverityRecommendation[] = []
    let hasDASS = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (dassRecord?.subscale_scores) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scores = dassRecord.subscale_scores as any
        if (typeof scores.depression === 'number') {
            dassSeverity = getDASSSeverityRecommendations({
                D: scores.depression || 0,
                A: scores.anxiety || 0,
                S: scores.stress || 0
            })
            hasDASS = true
        }
    }

    return {
        clinical: recommendations.clinical,
        transdiagnostic,
        dassSeverity,
        hasDASS
    }
}

function getProbabilityColor(probability: string) {
    switch (probability) {
        case 'high': return 'bg-red-100 text-red-700 border-red-200'
        case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        default: return 'bg-green-100 text-green-700 border-green-200'
    }
}

function getProbabilityLabel(probability: string) {
    switch (probability) {
        case 'high': return 'Xác suất cao'
        case 'moderate': return 'Xác suất trung bình'
        default: return 'Xác suất thấp'
    }
}

export default async function ClinicalInsightsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const result = await getClinicalData(user.id)

    if (!result || !result.clinical) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
                </Link>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">Cần hoàn thành bài kiểm tra Big Five để xem phân tích sức khỏe tâm thần</p>
                    <Link href="/tests/bfi2" className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Làm bài kiểm tra Big Five
                    </Link>
                </div>
            </div>
        )
    }

    const { clinical: clinicalData, transdiagnostic, dassSeverity, hasDASS } = result
    const highRiskCount = clinicalData.riskFactors.filter(r => r.probability === 'high').length
    const hasHighRisk = highRiskCount > 0

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
            </Link>

            {/* Header */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Heart className="h-8 w-8 text-rose-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sức khỏe Tâm thần</h1>
                        <p className="text-gray-600">Phân tích yếu tố rủi ro và bảo vệ</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-xl">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <span className={`text-3xl font-bold ${hasHighRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {highRiskCount}
                            </span>
                            <p className="text-sm text-gray-600">Yếu tố rủi ro cao</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200" />
                        <div className="text-center">
                            <span className="text-3xl font-bold text-emerald-600">
                                {clinicalData.protectiveFactorsVi.length}
                            </span>
                            <p className="text-sm text-gray-600">Yếu tố bảo vệ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Đây là phân tích sàng lọc dựa trên tính cách, không phải chẩn đoán y khoa.
                    Nếu bạn có lo ngại về sức khỏe tâm thần, hãy tham khảo ý kiến chuyên gia.
                </p>
            </div>

            {/* DASS Severity Interventions (NEW) */}
            {hasDASS && dassSeverity.length > 0 && (
                <div className="bg-white border border-rose-200 rounded-xl p-6 mb-8 ring-4 ring-rose-50">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                        <Activity className="h-5 w-5 text-rose-600" />
                        Khuyến nghị Can thiệp DASS-21
                    </h2>

                    <div className="space-y-6">
                        {dassSeverity.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {item.scale === 'depression' ? 'Trầm cảm (Depression)' :
                                            item.scale === 'anxiety' ? 'Lo âu (Anxiety)' : 'Căng thẳng (Stress)'}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.severity === 'severe' || item.severity === 'extremely_severe' ? 'bg-red-100 text-red-700' :
                                            item.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {item.severityVi}
                                    </span>
                                </div>

                                {(item.referralVi || item.referralIndicated) && (
                                    <div className="mb-3 p-3 bg-white border-l-4 border-red-500 text-red-700 text-sm">
                                        <strong>⚠️ {item.referralVi || 'Cần tham khảo ý kiến chuyên gia ngay.'}</strong>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Gợi ý can thiệp:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {item.recommendationsVi.map((rec, i) => (
                                            <li key={i} className="text-sm text-gray-600">{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transdiagnostic Processes (NEW) */}
            {transdiagnostic.length > 0 && (
                <div className="bg-white border border-purple-200 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Cơ chế Tâm lý Xuyên chẩn đoán
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {transdiagnostic.map((proc, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${proc.process.riskLevel === 'high' ? 'bg-red-50 border-red-200' :
                                    'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">{proc.process.nameVi}</h3>
                                    {proc.process.riskLevel === 'high' && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Nguy cơ cao</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{proc.process.descriptionVi || 'Cơ chế tâm lý liên quan đến rối loạn cảm xúc'}</p>

                                <div className="space-y-2">
                                    {proc.interventions.slice(0, 2).map((int, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm bg-white p-2 rounded border border-gray-100">
                                            <CheckCircle className="h-3 w-3 text-purple-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600 text-xs">{int.nameVi}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 text-right">Nguồn: Aldao et al. (2010)</p>
                </div>
            )}

            {/* Protective Factors */}
            {clinicalData.protectiveFactorsVi.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        Yếu tố bảo vệ từ tính cách của bạn
                    </h2>

                    <div className="space-y-3">
                        {clinicalData.protectiveFactorsVi.map((factor, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{factor}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Risk Factors */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Phân tích yếu tố rủi ro (từ Kotov et al., 2010)
                </h2>

                {clinicalData.riskFactors.map((risk, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{risk.disorderVi}</h3>
                                <p className="text-sm text-gray-500">{risk.disorder}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getProbabilityColor(risk.probability)}`}>
                                {getProbabilityLabel(risk.probability)}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600">{risk.reasoning}</p>

                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Yếu tố nguy cơ:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {risk.riskFactors && risk.riskFactors.length > 0 ? (
                                        risk.riskFactors.map((r, i) => (
                                            <li key={i} className="text-sm text-gray-600">
                                                {r.trait === 'N' ? 'Cảm xúc tiêu cực cao (N)' :
                                                    r.trait === 'C' ? 'Tính tận tâm thấp (C)' :
                                                        r.trait === 'E' ? 'Hướng ngoại thấp (E)' : r.trait}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-500">Thông tin chi tiết đang được cập nhật</li>
                                    )}
                                </ul>
                            </div>

                            {risk.treatments && risk.treatments.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Hướng điều trị gợi ý:</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {risk.treatments.slice(0, 3).map((t, i) => (
                                            <li key={i} className="text-sm text-gray-600">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                        <strong>Nguồn nghiên cứu:</strong> Kotov, R., et al. (2010). Linking "big" personality traits to anxiety, depressive, and substance use disorders: A meta-analysis. <em>Psychological Bulletin</em>.
                    </p>
                </div>
            </div>

            {/* CTA for Help */}
            {hasHighRisk && (
                <div className="mt-8 bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-rose-800 mb-2">Bạn cần hỗ trợ?</h3>
                    <p className="text-rose-700 mb-4">Nếu bạn đang gặp khó khăn về sức khỏe tâm thần, hãy liên hệ chuyên gia.</p>
                    <Link
                        href="/professional"
                        className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                        Tìm chuyên gia tâm lý
                    </Link>
                </div>
            )}
        </div>
    )
}
