import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import { getFlowStateRecommendations, type FlowStateRecommendation } from '@/services/enhanced-intervention.service'
import Link from 'next/link'
import { ArrowLeft, Activity, Dumbbell, Brain, Target, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Vận động & Thể thao | MISO Care',
    description: 'Gợi ý hoạt động thể thao và đánh giá Mental Toughness',
}

async function getSportsData(userId: string) {
    const supabase = await createClient()

    // Get user's personality profile
    const { data: profile } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

    // Get DASS scores for holistic analysis
    const { data: dassRecord } = await supabase
        .from('mental_health_records')
        .select('subscale_scores')
        .eq('user_id', userId)
        .eq('test_type', 'DASS21')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (!profile) return null

    const big5_raw = {
        O: profile.big5_openness_raw || profile.big5_openness || 50,
        C: profile.big5_conscientiousness_raw || profile.big5_conscientiousness || 50,
        E: profile.big5_extraversion_raw || profile.big5_extraversion || 50,
        A: profile.big5_agreeableness_raw || profile.big5_agreeableness || 50,
        N: profile.big5_neuroticism_raw || profile.big5_neuroticism || 50,
    }

    const misoResult = await runMisoAnalysis({
        big5_raw,
        mbti: profile.mbti_type || undefined,
        dass21_raw: dassRecord?.subscale_scores as any
    }, userId)

    const recommendations = getPersonalizedRecommendations(misoResult)

    // Get Flow State recommendations
    const flowStates = getFlowStateRecommendations(big5_raw)

    return {
        sports: recommendations.sports,
        flowStates
    }
}

function getLevelColor(level: string) {
    switch (level) {
        case 'high': return 'bg-green-500'
        case 'moderate': return 'bg-yellow-500'
        default: return 'bg-red-500'
    }
}

function getDimensionVi(dimension: string) {
    const map: Record<string, string> = {
        'control': 'Kiểm soát',
        'commitment': 'Cam kết',
        'challenge': 'Thử thách',
        'confidence': 'Tự tin',
    }
    return map[dimension] || dimension
}

export default async function SportsInsightsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const result = await getSportsData(user.id)

    if (!result || !result.sports) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
                </Link>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">Cần hoàn thành bài kiểm tra Big Five để xem gợi ý thể thao</p>
                    <Link href="/tests/bfi2" className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Làm bài kiểm tra Big Five
                    </Link>
                </div>
            </div>
        )
    }

    const { sports: sportsData, flowStates } = result

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
            </Link>

            {/* Header */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Vận động & Thể thao</h1>
                        <p className="text-gray-600">Dựa trên nghiên cứu về Mental Toughness</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-xl">
                    <div className="text-center">
                        <span className="text-4xl font-bold text-orange-600">{sportsData.mentalToughnessScore}</span>
                        <p className="text-gray-600 mt-1">Điểm Mental Toughness tổng thể</p>
                    </div>
                </div>
            </div>

            {/* Flow State - NEW SECTION */}
            {flowStates && flowStates.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-purple-600" />
                        Trạng thái Flow (Csikszentmihalyi, 1990)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {flowStates.map((flow: FlowStateRecommendation, i: number) => (
                            <div key={i} className={`p-3 rounded-lg ${flow.currentStatus === 'optimal' ? 'bg-green-100 border border-green-200' :
                                flow.currentStatus === 'blocked' ? 'bg-red-100 border border-red-200' :
                                    'bg-white/80 border border-gray-200'
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-700">{flow.condition.nameVi}</span>
                                    {flow.currentStatus === 'optimal' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                    {flow.currentStatus === 'blocked' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                                </div>
                                {flow.tipsVi && flow.tipsVi.length > 0 && (
                                    <p className="text-xs text-gray-600">Tip: {flow.tipsVi[0]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        Nguồn: Csikszentmihalyi (1990). Flow: The Psychology of Optimal Experience.
                    </p>
                </div>
            )}

            {/* Mental Toughness Dimensions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                    <Brain className="h-5 w-5 text-orange-500" />
                    4 Chiều của Mental Toughness (4C&apos;s)
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    {sportsData.dimensions.map((dim: { dimension: string; score: number; level: string }, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700">{getDimensionVi(dim.dimension)}</span>
                                <span className="text-2xl font-bold text-orange-600">{dim.score}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${getLevelColor(dim.level)}`}
                                    style={{ width: `${dim.score}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{dim.level}</p>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    Nguồn: Jones et al. (2002). DOI: 10.1080/10413200290103509
                </p>
            </div>

            {/* Recommended Activities */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-orange-500" />
                    Hoạt động thể thao phù hợp
                </h2>

                {sportsData.activities.map((activity: { nameVi: string; category: string; mentalBenefitsVi: string[] }, index: number) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center h-10 w-10 bg-orange-100 rounded-full text-orange-600 font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{activity.nameVi}</h3>
                                <p className="text-sm text-gray-500 capitalize">{activity.category}</p>

                                <div className="mt-3">
                                    <div className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Lợi ích tâm lý:</p>
                                            <ul className="text-sm text-gray-600 mt-1">
                                                {activity.mentalBenefitsVi.map((benefit: string, i: number) => (
                                                    <li key={i}>• {benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Source Citation */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                    <strong>Nguồn nghiên cứu:</strong> {sportsData.source}
                </p>
            </div>
        </div>
    )
}
