"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, Shield, TrendingDown, TrendingUp } from "lucide-react";

interface CausalPathwayCardProps {
    mechanisms?: {
        active: Array<{
            id: string;
            pathway: string;
            strength: number;
            predictedDASS: { D?: number; A?: number; S?: number };
        }>;
        compensations: Array<{
            id: string;
            condition: string;
            mechanism: string;
            strength: string;
            percentile: number;
        }>;
        residual?: {
            D: number;
            A: number;
            S: number;
            interpretation: string;
        };
    };
}

export function CausalPathwayCard({ mechanisms }: CausalPathwayCardProps) {
    if (!mechanisms || (!mechanisms.active?.length && !mechanisms.compensations?.length)) {
        return null;
    }

    const { active, compensations, residual } = mechanisms;

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                    🧬 Phân Tích Nguyên Nhân Sâu
                </CardTitle>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Hiểu cách tính cách của bạn ảnh hưởng đến tâm lý
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Active Risk Mechanisms */}
                {active && active.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            Cơ Chế Rủi Ro Đang Hoạt Động
                        </h4>

                        {active.map((mechanism, idx) => (
                            <div
                                key={idx}
                                className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-red-200 dark:border-red-800/50 space-y-2"
                            >
                                {/* Pathway Description */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                        <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {mechanism.pathway}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Badge variant="outline" className="text-xs px-1.5 py-0">
                                                Độ mạnh: {(mechanism.strength * 100).toFixed(0)}%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Predicted Impact */}
                                {mechanism.predictedDASS && Object.keys(mechanism.predictedDASS).length > 0 && (
                                    <div className="pl-8 space-y-1">
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            Ảnh hưởng dự đoán:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {mechanism.predictedDASS.D && (
                                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                                                    Trầm cảm: +{mechanism.predictedDASS.D}
                                                </span>
                                            )}
                                            {mechanism.predictedDASS.A && (
                                                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
                                                    Lo âu: +{mechanism.predictedDASS.A}
                                                </span>
                                            )}
                                            {mechanism.predictedDASS.S && (
                                                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                                                    Căng thẳng: +{mechanism.predictedDASS.S}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Compensatory Pathways */}
                {compensations && compensations.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 flex items-center gap-1.5">
                            <Shield className="h-4 w-4" />
                            Yếu Tố Bảo Vệ (Điểm Mạnh Đang Hỗ Trợ)
                        </h4>

                        {compensations.map((comp, idx) => (
                            <div
                                key={idx}
                                className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-green-200 dark:border-green-800/50 space-y-2"
                            >
                                <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                                        <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                                            {comp.strength} (Nhóm {100 - comp.percentile}%)
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                            {comp.mechanism}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Visual Flow Diagram */}
                <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between text-xs">
                        <div className="text-center flex-1">
                            <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Tính Cách</div>
                            <div className="text-slate-500 dark:text-slate-400">Đặc điểm Big5</div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mx-2" />

                        <div className="text-center flex-1">
                            <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Điểm Mạnh</div>
                            <div className="text-slate-500 dark:text-slate-400">Yếu tố VIA</div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mx-2" />

                        <div className="text-center flex-1">
                            <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Kết Quả</div>
                            <div className="text-slate-500 dark:text-slate-400">Chỉ số DASS</div>
                        </div>
                    </div>
                </div>

                {/* Residual Distress Interpretation */}
                {residual && residual.interpretation && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">
                            💡 Giải Thích
                        </h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                            {residual.interpretation}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
