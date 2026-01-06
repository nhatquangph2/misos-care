'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestHistory from '@/components/profile/TestHistory';
import RecommendationsCard from '@/components/profile/RecommendationsCard';
import GoalsAndPlansView from '@/components/goals/GoalsAndPlansView';
import { MisoInsightCard } from '@/components/profile/MisoInsightCard';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Activity, Brain, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GlossaryHighlighter } from '@/components/ui/GlossaryTooltip';

const UserEngagement = dynamic(() => import('@/components/gamification/UserEngagement'), { ssr: false });

// Lazy load heavy chart components
const ChartSkeleton = () => (
    <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
);

const PersonalityOverview = dynamic(
    () => import('@/components/profile/PersonalityOverview'),
    {
        loading: () => <ChartSkeleton />,
        ssr: true
    }
);

const MentalHealthChart = dynamic(
    () => import('@/components/profile/MentalHealthChart'),
    {
        loading: () => <ChartSkeleton />,
        ssr: false
    }
);

// BFI2Score structure
interface BFI2Score {
    domains?: { O: number; C: number; E: number; A: number; N: number }
    facets?: Record<string, unknown>
    tScores?: { domains: { O: number; C: number; E: number; A: number; N: number } }
    percentiles?: { domains: { O: number; C: number; E: number; A: number; N: number } }
    raw_scores?: { O: number; C: number; E: number; A: number; N: number }
}

interface ProfileClientViewProps {
    profileData: {
        personality?: {
            mbti_type?: string
        }
        mentalHealthRecords?: Array<unknown>
        trends?: Array<unknown>
        recommendations?: Array<{
            id: string
            title: string
            description: string
            priority: string
        }>
    }
    timeline: Array<{
        id: string
        testName: string
        date: string
        type: string
        score?: number
        severity?: string
        crisisFlag?: boolean
        domains?: Record<string, number>
        mbtiType?: string
    }>
    unifiedProfile: {
        mbti?: { type: string }
        big5?: BFI2Score
        dass?: { D: number; A: number; S: number }
        via?: Record<string, number>
        miso_analysis?: {
            scores?: { BVS?: number; RCS?: number }
            profile?: unknown
        }
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
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportHistory = async () => {
        try {
            setIsExporting(true);
            const { exportTestHistoryData } = await import('@/services/test-history.service');
            const data = await exportTestHistoryData();

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `test-history-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
            alert('Không thể xuất lịch sử');
        } finally {
            setIsExporting(false);
        }
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/auth/login');
        router.refresh();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-10 relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -z-10" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-2">
                            Hành Trình <span className="gradient-text">Của Tôi</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Xin chào, {userName}! Theo dõi tiến độ, xem phân tích chi tiết và nhận đề xuất cá nhân hóa
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="glass-card px-6 py-3 rounded-2xl font-medium hover:scale-105 transition-transform self-start sm:self-auto"
                    >
                        Đăng Xuất
                    </button>
                </div>
            </div>

            {/* Gamification Status */}
            <UserEngagement userId={userId} />

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="glass-card shape-organic-1 p-6 text-center group cursor-pointer">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🧠</div>
                    <div className="text-3xl font-heading font-bold text-purple-700 dark:text-purple-300 mb-1">
                        {profileData?.personality?.mbti_type || unifiedProfile?.mbti?.type || '---'}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        MBTI Type
                    </div>
                </div>

                <div className="glass-card shape-organic-2 p-6 text-center group cursor-pointer">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                    <div className="text-3xl font-heading font-bold text-blue-700 dark:text-blue-300 mb-1">
                        {profileData?.mentalHealthRecords?.length || 0}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Bài Test
                    </div>
                </div>

                <div className="glass-card shape-organic-1 p-6 text-center group cursor-pointer">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📈</div>
                    <div className="text-3xl font-heading font-bold text-pink-700 dark:text-pink-300 mb-1">
                        {profileData?.trends?.length || 0}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Theo Dõi
                    </div>
                </div>

                <div className="glass-card shape-organic-2 p-6 text-center group cursor-pointer">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💡</div>
                    <div className="text-3xl font-heading font-bold text-orange-700 dark:text-orange-300 mb-1">
                        {profileData?.recommendations?.length || 0}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Đề Xuất
                    </div>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="overview" className="gap-2">
                        <span>🎯</span>
                        <span className="hidden sm:inline">Tổng Quan</span>
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-2">
                        <span>📅</span>
                        <span className="hidden sm:inline">Lịch Sử</span>
                    </TabsTrigger>
                    <TabsTrigger value="personality" className="gap-2">
                        <span>🧠</span>
                        <span className="hidden sm:inline">Tính Cách</span>
                    </TabsTrigger>
                    <TabsTrigger value="health" className="gap-2">
                        <span>📊</span>
                        <span className="hidden sm:inline">Sức Khỏe</span>
                    </TabsTrigger>
                    <TabsTrigger value="goals" className="gap-2">
                        <span>🎪</span>
                        <span className="hidden sm:inline">Mục Tiêu</span>
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="gap-2">
                        <span>💡</span>
                        <span className="hidden sm:inline">Đề Xuất</span>
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* MISO V3 Insight Card - Top Priority */}
                    <MisoInsightCard analysis={unifiedProfile?.miso_analysis} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <PersonalityOverview profile={profileData?.personality || null} />
                            <RecommendationsCard recommendations={profileData?.recommendations || []} />
                        </div>
                        <div className="space-y-6">
                            <MentalHealthChart trends={profileData?.trends || []} />
                            <TestHistory records={profileData?.mentalHealthRecords?.slice(0, 5) || []} />
                        </div>
                    </div>
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={async () => {
                                setIsExporting(true);
                                try {
                                    const { reportGeneratorService } = await import('@/services/report-generator.service');
                                    await reportGeneratorService.generatePDF(unifiedProfile, userName);
                                } catch (e) {
                                    console.error(e);
                                    alert('Lỗi xuất PDF: ' + (e as Error).message);
                                } finally {
                                    setIsExporting(false);
                                }
                            }}
                            variant="default"
                            className="gap-2 bg-purple-600 hover:bg-purple-700"
                            disabled={isExporting}
                        >
                            <Download className="h-4 w-4" />
                            {isExporting ? 'Đang tạo...' : 'Xuất Báo Cáo (PDF)'}
                        </Button>
                        <Button
                            onClick={handleExportHistory}
                            variant="outline"
                            className="gap-2"
                            disabled={isExporting}
                        >
                            <Activity className="h-4 w-4" />
                            {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu thô (JSON)'}
                        </Button>
                    </div>

                    <div className="glass-panel rounded-2xl p-6">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 glass-text">
                            <Clock className="h-6 w-6 text-purple-500" />
                            Lịch Sử Đầy Đủ
                        </h3>

                        {timeline.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">Chưa có dữ liệu test nào</p>
                                <Button variant="outline" onClick={() => router.push('/tests')}>
                                    Bắt đầu làm test
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {timeline.map((entry, index) => (
                                    <div key={entry.id} className="relative">
                                        {index < timeline.length - 1 && (
                                            <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-transparent" />
                                        )}

                                        <div className="flex gap-4">
                                            <div className={`
                                                w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg
                                                ${entry.type === 'personality'
                                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'}
                                            `}>
                                                {entry.type === 'personality' ? (
                                                    <Brain className="h-6 w-6 text-white" />
                                                ) : (
                                                    <Activity className="h-6 w-6 text-white" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="glass-card backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-bold text-lg mb-1">
                                                                <GlossaryHighlighter text={entry.testName} />
                                                            </h4>
                                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(entry.date).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>

                                                        {entry.crisisFlag && (
                                                            <Badge className="bg-red-500 text-white gap-1">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                Cần hỗ trợ
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {entry.type === 'mental_health' && entry.score !== undefined && (
                                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div className="bg-white/20 dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/30 dark:border-white/10">
                                                                <p className="text-xs text-gray-500 mb-1">Điểm số</p>
                                                                <p className="text-2xl font-bold text-purple-600">{entry.score}</p>
                                                            </div>
                                                            <div className="bg-white/20 dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/30 dark:border-white/10">
                                                                <p className="text-xs text-gray-500 mb-1">Mức độ</p>
                                                                <Badge variant="outline" className="mt-1">
                                                                    {entry.severity === 'normal' && 'Bình thường'}
                                                                    {entry.severity === 'mild' && 'Nhẹ'}
                                                                    {entry.severity === 'moderate' && 'Trung bình'}
                                                                    {entry.severity === 'severe' && 'Nặng'}
                                                                    {entry.severity === 'extremely_severe' && 'Rất nặng'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {entry.type === 'personality' && entry.domains && (
                                                        <div className="grid grid-cols-5 gap-2 mt-4">
                                                            {Object.entries(entry.domains).map(([key, value]) => (
                                                                <div key={key} className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-3 text-center border border-purple-200 dark:border-purple-700">
                                                                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">{key}</p>
                                                                    <p className="text-lg font-bold text-purple-700 dark:text-purple-200">{value?.toFixed(1)}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {entry.mbtiType && (
                                                        <div className="mt-4">
                                                            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                                                {entry.mbtiType}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Personality Tab */}
                <TabsContent value="personality" className="space-y-6">
                    <PersonalityOverview profile={profileData?.personality || null} />

                    {(profileData?.personality?.mbti_type || unifiedProfile?.mbti?.type) && (
                        <div className="glass-card backdrop-blur-md bg-purple-500/10 dark:bg-purple-500/20 p-6 sm:p-8 rounded-2xl">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Về Tính Cách {profileData?.personality?.mbti_type || unifiedProfile?.mbti?.type}</h3>
                            <div className="prose max-w-none dark:prose-invert">
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    <GlossaryHighlighter text={`Tính cách ${profileData?.personality?.mbti_type || unifiedProfile?.mbti?.type} là một trong 16 loại tính cách theo MBTI. Mỗi chữ cái đại diện cho một sở thích cá nhân.`} />
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Mental Health Tab */}
                <TabsContent value="health" className="space-y-6">
                    <MentalHealthChart trends={profileData?.trends || []} />
                    <TestHistory records={profileData?.mentalHealthRecords || []} />

                    <div className="glass-card backdrop-blur-md bg-blue-500/10 dark:bg-blue-500/20 p-6 rounded-xl">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <span>ℹ️</span>
                            Lưu Ý Quan Trọng
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Các bài test này chỉ mang tính chất tham khảo. Nếu bạn cảm thấy lo lắng về sức khỏe tinh thần,
                            hãy tìm kiếm sự hỗ trợ từ chuyên gia. Hotline: <strong>1800-599-920</strong> (24/7, miễn phí).
                        </p>
                    </div>
                </TabsContent>

                {/* Goals Tab */}
                <TabsContent value="goals" className="space-y-6">
                    <GoalsAndPlansView userId={userId} />
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-6">
                    <RecommendationsCard recommendations={profileData?.recommendations || []} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card backdrop-blur-md bg-green-500/10 dark:bg-green-500/20 p-6 rounded-xl">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span>🌱</span>
                                Thói Quen Lành Mạnh
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">✓</span>
                                    <span>Ngủ đủ 7-8 giờ mỗi đêm</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">✓</span>
                                    <span>Tập thể dục ít nhất 30 phút/ngày</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">✓</span>
                                    <span>Ăn uống cân bằng, đủ dinh dưỡng</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">✓</span>
                                    <span>Giảm sử dụng mạng xã hội</span>
                                </li>
                            </ul>
                        </div>

                        <div className="glass-card backdrop-blur-md bg-purple-500/10 dark:bg-purple-500/20 p-6 rounded-xl">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span>📚</span>
                                Tài Nguyên Hữu Ích
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        📖 Thư viện bài viết sức khỏe tinh thần (Sắp ra mắt)
                                    </span>
                                </li>
                                <li>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        🎧 Podcast về tâm lý học (Sắp ra mắt)
                                    </span>
                                </li>
                                <li>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        <GlossaryHighlighter text="🎯 Bài tập CBT hướng dẫn (Sắp ra mắt)" />
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
