'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Briefcase, BookOpen, Activity, Heart, ArrowRight } from 'lucide-react'
import type { PersonalizedRecommendations } from '@/services/recommendation.service'

interface RecommendationSummaryCardsProps {
    recommendations: PersonalizedRecommendations | null
    isLoading?: boolean
}

export function RecommendationSummaryCards({ recommendations, isLoading }: RecommendationSummaryCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="animate-pulse bg-gray-100">
                        <CardHeader><div className="h-6 bg-gray-200 rounded w-3/4" /></CardHeader>
                        <CardContent><div className="h-16 bg-gray-200 rounded" /></CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!recommendations) {
        return (
            <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                    <p className="text-yellow-700">Cần hoàn thành bài kiểm tra Big Five để xem gợi ý cá nhân hóa</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Career Card */}
            {recommendations.career && (
                <Link href="/insights/career">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow cursor-pointer group">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Briefcase className="h-5 w-5 text-indigo-600" />
                                Hướng nghiệp
                                <ArrowRight className="h-4 w-4 ml-auto text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-indigo-600">{recommendations.career.hollandCode}</span>
                                <span className="text-sm text-gray-500">Mã Holland</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                Top nghề: {recommendations.career.careers.slice(0, 2).map(c => c.titleVi).join(', ')}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            )}

            {/* Learning Card */}
            {recommendations.learning && (
                <Link href="/insights/learning">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow cursor-pointer group">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-emerald-600" />
                                Phương pháp học tập
                                <ArrowRight className="h-4 w-4 ml-auto text-emerald-400 group-hover:translate-x-1 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-emerald-600">
                                    {recommendations.learning.techniques.filter(t => t.effectivenessLevel === 'high').length}
                                </span>
                                <span className="text-sm text-gray-500">kỹ thuật hiệu quả cao</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {recommendations.learning.techniques[0]?.nameVi}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            )}

            {/* Sports Card */}
            {recommendations.sports && (
                <Link href="/insights/sports">
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-md transition-shadow cursor-pointer group">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-orange-600" />
                                Vận động & Thể thao
                                <ArrowRight className="h-4 w-4 ml-auto text-orange-400 group-hover:translate-x-1 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-orange-600">
                                    {recommendations.sports.mentalToughnessScore}
                                </span>
                                <span className="text-sm text-gray-500">Mental Toughness</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                Phù hợp: {recommendations.sports.activities.slice(0, 2).map(a => a.nameVi).join(', ')}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            )}

            {/* Clinical Card */}
            {recommendations.clinical && (
                <Link href="/insights/clinical">
                    <Card className="bg-gradient-to-br from-rose-50 to-pink-50 hover:shadow-md transition-shadow cursor-pointer group">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Heart className="h-5 w-5 text-rose-600" />
                                Sức khỏe tâm thần
                                <ArrowRight className="h-4 w-4 ml-auto text-rose-400 group-hover:translate-x-1 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-emerald-600">
                                    {recommendations.clinical.protectiveFactorsVi.length}
                                </span>
                                <span className="text-sm text-gray-500">yếu tố bảo vệ</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {recommendations.clinical.protectiveFactorsVi[0] || 'Xem chi tiết phân tích'}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            )}
        </div>
    )
}

export default RecommendationSummaryCards
