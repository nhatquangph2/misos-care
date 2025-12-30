import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Building2, Star } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Định hướng Nghề nghiệp | MISO Care',
    description: 'Gợi ý nghề nghiệp dựa trên tính cách theo Holland RIASEC và Big Five',
}

async function getCareerData(userId: string) {
    const supabase = await createClient()

    // Get user's personality profile
    const { data: profile } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (!profile) return null

    const big5_raw = {
        O: profile.big5_openness ?? 50,
        C: profile.big5_conscientiousness ?? 50,
        E: profile.big5_extraversion ?? 50,
        A: profile.big5_agreeableness ?? 50,
        N: profile.big5_neuroticism ?? 50,
    }

    const misoResult = await runMisoAnalysis({
        big5_raw,
        mbti: profile.mbti_type || undefined,
    }, userId)

    const recommendations = getPersonalizedRecommendations(misoResult)
    return recommendations.career
}

export default async function CareerInsightsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const careerData = await getCareerData(user.id)

    if (!careerData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
                </Link>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">Cần hoàn thành bài kiểm tra Big Five để xem gợi ý nghề nghiệp</p>
                    <Link href="/tests/bfi2" className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Làm bài kiểm tra Big Five
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
            </Link>

            {/* Header */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Briefcase className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Định hướng Nghề nghiệp</h1>
                        <p className="text-gray-600">Dựa trên lý thuyết Holland RIASEC và Big Five</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-xl">
                    <div className="text-center">
                        <span className="text-4xl font-bold text-indigo-600">{careerData.hollandCode}</span>
                        <p className="text-gray-600 mt-1">Mã Holland của bạn</p>
                    </div>
                </div>
            </div>

            {/* Career List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Top 5 Nghề nghiệp phù hợp
                </h2>

                {careerData.careers.map((career, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center justify-center h-10 w-10 bg-indigo-100 rounded-full text-indigo-600 font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{career.titleVi}</h3>
                                    <p className="text-sm text-gray-500">{career.title}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Mã Holland: {career.hollandCode}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-indigo-600">{career.fitScore}</span>
                                <p className="text-sm text-gray-500">% phù hợp</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Source Citation */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                    <strong>Nguồn nghiên cứu:</strong> {careerData.source}
                </p>
            </div>
        </div>
    )
}
