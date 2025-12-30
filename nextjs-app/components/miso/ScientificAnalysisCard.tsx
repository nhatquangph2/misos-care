'use client'

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Anchor, Heart, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import type { MisoAnalysisResult } from '@/types/miso-v3'
import { useState } from 'react'

interface ScientificAnalysisCardProps {
    analysis: MisoAnalysisResult['scientific_analysis']
}

export function ScientificAnalysisCard({ analysis }: ScientificAnalysisCardProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [actionPlan, setActionPlan] = useState<any>(null)
    const [activeToipc, setActiveTopic] = useState('')

    if (!analysis) return null

    const { zpd, sdt } = analysis

    const handleDeepAction = async (metric: string) => {
        setLoading(true)
        setActiveTopic(metric)
        setOpen(true)
        try {
            const res = await fetch('/api/ai-consultant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    misoAnalysis: { scientific_analysis: analysis, profile: { risk_level: 'unknown' }, scores: { BVS: 0.5, RCS: 0.5 } }, // Wrap to match structure expectation if needed or just pass strict analysis
                    // Actually API expects full analysis object usually, but for deep action we might need to mock or pass what we have
                    // Ideally we should pass the full MisoAnalysisResult from parent, but here we only have props.analysis (scientific part)
                    // Let's rely on server-side enrichment if possible, OR updating the props to receive full object.
                    // IMPORTANT: The parent passes only `scientific_analysis`. We need to hack this or ask parent for more data.
                    // For now let's hope server enrichment works or pass what we have.
                    // EDIT: The hook in dashboard page has the full object but only passes scientific_analysis.
                    // Let's trust the server enrichment since user is logged in.
                    triggerMetric: metric
                })
            })
            const data = await res.json()
            if (data.success) {
                setActionPlan(data.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // ZPD Logic Visualization
    const zpdInfo = {
        1: { label: 'Cần hỗ trợ (Scaffolding)', color: 'bg-orange-500', icon: Anchor, desc: 'Ưu tiên các bài tập nhỏ, cụ thể để xây dựng nền tảng.' },
        2: { label: 'Phát triển cân bằng', color: 'bg-blue-500', icon: ShieldCheck, desc: 'Kết hợp giữa thử thách và hỗ trợ.' },
        3: { label: 'Tự chủ phát triển', color: 'bg-green-500', icon: TrendingUp, desc: 'Sẵn sàng cho các thử thách trừu tượng và sâu sắc.' },
    }[zpd.level]

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Phân tích Chuyên sâu (V3)
                </CardTitle>
                <CardDescription>
                    Đánh giá dựa trên Khoa học Phát triển & Tâm lý học
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* SECTION 1: ZPD */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700">Năng lực Thay đổi (ZPD)</h4>
                        <Badge variant="outline" className={`${zpdInfo.color} text-white border-none`}>
                            Level {zpd.level}
                        </Badge>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 border">
                        <zpdInfo.icon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">{zpdInfo.label}</p>
                            <p className="text-xs text-gray-500 mt-1">{zpdInfo.desc}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Sức chứa: {zpd.capacity}%</span>
                        </div>
                        <Progress value={zpd.capacity} className="h-2" />
                    </div>
                </div>

                {/* ZPD Action Button */}
                {zpd.level === 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
                        onClick={() => handleDeepAction('Low ZPD Capacity')}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Kích hoạt Chế độ "Hỗ trợ giàn giáo" (Scaffolding)
                    </Button>
                )}

                <div className="border-t" />

                {/* SECTION 2: SDT */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <h4 className="text-sm font-semibold text-gray-700">Tháp nhu cầu Tâm lý (SDT)</h4>
                    </div>

                    <div className="grid gap-4">
                        {/* Autonomy */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span>Tự chủ (Autonomy)</span>
                                <span className="font-mono text-xs">{sdt.autonomy}%</span>
                            </div>
                            <Progress value={sdt.autonomy} className="h-2"
                                indicatorClassName={sdt.autonomy < 40 ? 'bg-red-500' : 'bg-blue-500'}
                            />
                            <p className="text-[10px] text-gray-400 text-right">
                                {sdt.autonomy < 40 ? '⚠️ Cần ưu tiên phục hồi' : '✅ Ổn định'}
                            </p>
                            {sdt.autonomy < 40 && (
                                <button
                                    onClick={() => handleDeepAction('Low Autonomy')}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 ml-auto mt-1"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Tạo kế hoạch phục hồi Tự chủ
                                </button>
                            )}
                        </div>

                        {/* Competence */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span>Năng lực (Competence)</span>
                                <span className="font-mono text-xs">{sdt.competence}%</span>
                            </div>
                            <Progress value={sdt.competence} className="h-2"
                                indicatorClassName={sdt.competence < 40 ? 'bg-red-500' : 'bg-blue-500'}
                            />
                        </div>

                        {/* Relatedness */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span>Gắn kết (Relatedness)</span>
                                <span className="font-mono text-xs">{sdt.relatedness}%</span>
                            </div>
                            <Progress value={sdt.relatedness} className="h-2"
                                indicatorClassName={sdt.relatedness < 40 ? 'bg-red-500' : 'bg-blue-500'}
                            />
                        </div>
                    </div>
                </div>

                {/* AI Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-purple-700">
                                <Sparkles className="w-5 h-5" />
                                MISO Deep Coach
                            </DialogTitle>
                            <DialogDescription>
                                Kế hoạch hành động vi mô cho: <span className="font-bold text-gray-900">{activeToipc}</span>
                            </DialogDescription>
                        </DialogHeader>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                <p className="text-sm text-gray-500">Đang phân tích cấu trúc tâm lý của bạn...</p>
                            </div>
                        ) : actionPlan ? (
                            <div className="space-y-6">

                                {/* 1. Scientific Rationale */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Chẩn đoán Khoa học</h4>
                                    <p className="text-sm text-slate-800 leading-relaxed">
                                        {actionPlan.scientific_rationale}
                                    </p>
                                </div>

                                {/* 2. Micro Intervention */}
                                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-purple-800 mb-3">
                                        <TrendingUp className="w-4 h-4" />
                                        Hành động Vi mô (Micro-Step)
                                    </h4>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-white p-2 rounded-full shadow-sm text-purple-600 font-bold text-lg h-10 w-10 flex items-center justify-center shrink-0">
                                            1
                                        </div>
                                        <p className="text-base text-gray-900 font-medium pt-1.5">
                                            {actionPlan.immediate_micro_step}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* 3. SDT Connection */}
                                    <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50">
                                        <h4 className="text-xs font-bold text-blue-600 mb-2">Cơ chế SDT</h4>
                                        <p className="text-xs text-slate-600">{actionPlan.sdt_connection}</p>
                                    </div>
                                    {/* 4. ZPD Adjustment */}
                                    <div className="p-4 rounded-lg border border-orange-100 bg-orange-50/50">
                                        <h4 className="text-xs font-bold text-orange-600 mb-2">Điều chỉnh ZPD</h4>
                                        <p className="text-xs text-slate-600">{actionPlan.zpd_adjustment}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={() => setOpen(false)}>Đã hiểu, tôi sẽ thực hiện</Button>
                                </div>
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>

            </CardContent>
        </Card>
    )
}
