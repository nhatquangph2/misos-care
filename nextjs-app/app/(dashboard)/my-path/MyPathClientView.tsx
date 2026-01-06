'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Brain,
    Heart,
    Target,
    Calendar,
    TrendingUp,
    Award,
    Clock
} from 'lucide-react'

interface ProfileClientViewProps {
    profileData: {
        mbtiType?: string
        big5Summary?: {
            O?: number
            C?: number
            E?: number
            A?: number
            N?: number
        }
        dassScores?: {
            D?: number
            A?: number
            S?: number
        }
    }
    timeline: Array<{
        id: string
        testType: string
        completedAt: string
        score?: number
    }>
    unifiedProfile: {
        mbti?: { type: string }
        big5?: { O: number; C: number; E: number; A: number; N: number }
        dass?: { D: number; A: number; S: number }
        via?: Record<string, number>
    }
    userId: string
    userName: string
}

export default function ProfileClientView({
    profileData,
    timeline,
    unifiedProfile,
    userId,
    userName
}: ProfileClientViewProps) {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Hành trình của tôi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Xin chào, {userName}! Đây là tổng quan về hành trình phát triển cá nhân của bạn.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Tổng quan</span>
                    </TabsTrigger>
                    <TabsTrigger value="personality" className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span className="hidden sm:inline">Tính cách</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Lịch sử</span>
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* MBTI Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-purple-500" />
                                    MBTI
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {unifiedProfile?.mbti?.type ? (
                                    <div className="text-3xl font-bold text-purple-600">
                                        {unifiedProfile.mbti.type}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Chưa hoàn thành</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Big5 Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-500" />
                                    Big Five
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {unifiedProfile?.big5 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {['O', 'C', 'E', 'A', 'N'].map((trait) => {
                                            const value = (unifiedProfile.big5 as Record<string, unknown>)?.[trait]
                                            if (typeof value !== 'number') return null
                                            return (
                                                <Badge key={trait} variant="secondary">
                                                    {trait}: {Math.round(value)}%
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Chưa hoàn thành</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* DASS Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    DASS-21
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {unifiedProfile?.dass ? (
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">D: {unifiedProfile.dass.D}</Badge>
                                        <Badge variant="outline">A: {unifiedProfile.dass.A}</Badge>
                                        <Badge variant="outline">S: {unifiedProfile.dass.S}</Badge>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Chưa hoàn thành</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Personality Tab */}
                <TabsContent value="personality" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hồ sơ tính cách chi tiết</CardTitle>
                            <CardDescription>
                                Kết quả từ các bài đánh giá tâm lý của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {unifiedProfile?.big5 ? (
                                <div className="space-y-4">
                                    {['O', 'C', 'E', 'A', 'N'].map((trait) => {
                                        const value = (unifiedProfile.big5 as Record<string, unknown>)?.[trait]
                                        if (typeof value !== 'number') return null
                                        return (
                                            <div key={trait} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{getTraitName(trait)}</span>
                                                    <span>{Math.round(value)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    Hoàn thành bài đánh giá Big Five để xem kết quả chi tiết
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Lịch sử đánh giá
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {timeline && timeline.length > 0 ? (
                                <div className="space-y-4">
                                    {timeline.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Award className="w-5 h-5 text-yellow-500" />
                                                <div>
                                                    <p className="font-medium">{item.testType}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(item.completedAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                            {item.score && (
                                                <Badge>
                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                    {item.score}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    Chưa có lịch sử đánh giá
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function getTraitName(trait: string): string {
    const names: Record<string, string> = {
        O: 'Cởi mở (Openness)',
        C: 'Tận tâm (Conscientiousness)',
        E: 'Hướng ngoại (Extraversion)',
        A: 'Dễ chịu (Agreeableness)',
        N: 'Nhạy cảm (Neuroticism)'
    }
    return names[trait] || trait
}
