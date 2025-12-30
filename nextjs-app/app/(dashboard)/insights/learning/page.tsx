import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import { getMBTILearningProfile, type MBTILearningProfile } from '@/services/enhanced-intervention.service'
import Link from 'next/link'
import { ArrowLeft, BookOpen, TrendingUp, Lightbulb, CheckCircle, Brain, GraduationCap, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Phương pháp Học tập | MISO Care',
    description: 'Gợi ý kỹ thuật học tập hiệu quả dựa trên nghiên cứu Dunlosky et al. (2013)',
}

async function getLearningData(userId: string) {
    const supabase = await createClient()

    // Get user's personality profile with correct column names
    const { data: profile } = await supabase
        .from('personality_profiles')
        .select('big5_openness, big5_conscientiousness, big5_extraversion, big5_agreeableness, big5_neuroticism, mbti_type')
        .eq('user_id', userId)
        .single()

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

    // Get MBTI learning profile if available
    const mbtiLearning = profile.mbti_type ? getMBTILearningProfile(profile.mbti_type) : null

    return {
        learning: recommendations.learning,
        mbtiLearning,
        mbtiType: profile.mbti_type
    }
}

function getEffectivenessColor(level: string) {
    switch (level) {
        case 'high': return 'bg-green-100 text-green-700 border-green-200'
        case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

function getEffectivenessLabel(level: string) {
    switch (level) {
        case 'high': return 'Hiệu quả cao'
        case 'moderate': return 'Hiệu quả trung bình'
        default: return 'Hiệu quả thấp'
    }
}

export default async function LearningInsightsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const learningDataResult = await getLearningData(user.id)

    if (!learningDataResult || !learningDataResult.learning) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
                </Link>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">Cần hoàn thành bài kiểm tra Big Five để xem gợi ý học tập</p>
                    <Link href="/tests/bfi2" className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Làm bài kiểm tra Big Five
                    </Link>
                </div>
            </div>
        )
    }

    const { learning: learningData, mbtiLearning, mbtiType } = learningDataResult

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
            </Link>

            {/* Header */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <BookOpen className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Phương pháp Học tập</h1>
                        <p className="text-gray-600">Dựa trên nghiên cứu Dunlosky et al. (2013)</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-xl">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-emerald-600">
                                {learningData.techniques.filter((t: { effectivenessLevel: string }) => t.effectivenessLevel === 'high').length}
                            </span>
                            <p className="text-sm text-gray-600">Kỹ thuật hiệu quả cao</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200" />
                        <div className="text-center">
                            <span className="text-3xl font-bold text-emerald-600">
                                {learningData.techniques.length}
                            </span>
                            <p className="text-sm text-gray-600">Kỹ thuật phù hợp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MBTI Learning Profile Section */}
            {mbtiLearning && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Phong cách học tập theo MBTI ({mbtiType})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/80 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                                <GraduationCap className="h-4 w-4 text-purple-500" />
                                Cách tiếp cận lý tưởng
                            </h3>
                            <p className="text-sm text-gray-600">{mbtiLearning.learningStyle.preferredApproachVi}</p>
                        </div>

                        <div className="bg-white/80 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Điểm mạnh học tập</h3>
                            <div className="flex flex-wrap gap-2">
                                {mbtiLearning.learningStyle.strengthsVi.map((s: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                Thách thức
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mbtiLearning.learningStyle.challengesVi.map((c: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">{c}</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Môi trường lý tưởng</h3>
                            <p className="text-sm text-gray-600">{mbtiLearning.studyEnvironment.idealVi}</p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        Nguồn: McCrae & Costa (1989). DOI: 10.1111/j.1467-6494.1989.tb00759.x
                    </p>
                </div>
            )}

            {/* Techniques List */}
            <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Kỹ thuật học tập được đề xuất
                </h2>

                {learningData.techniques.map((technique: { name: string; nameVi: string; effectivenessLevel: string; effectSize: number; whyForYouVi: string }, index: number) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{technique.nameVi}</h3>
                                <p className="text-sm text-gray-500">{technique.name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEffectivenessColor(technique.effectivenessLevel)}`}>
                                {getEffectivenessLabel(technique.effectivenessLevel)}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Effect size: <strong>{technique.effectSize.toFixed(2)}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-emerald-800">{technique.whyForYouVi}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Study Tips */}
            {learningData.studyTipsVi.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-gray-600" />
                        Lời khuyên học tập
                    </h2>
                    <ul className="space-y-2">
                        {learningData.studyTipsVi.map((tip: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span className="text-gray-700">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Source Citation */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                    <strong>Nguồn nghiên cứu:</strong> {learningData.source}
                </p>
            </div>
        </div>
    )
}
