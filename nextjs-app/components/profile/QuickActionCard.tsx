"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Star } from "lucide-react";

interface VIAProblemMatch {
    id: string;
    intervention: string;
    technique: string;
    mechanism?: string;
    expected_effect: number;
}

interface QuickActionCardProps {
    viaProblemMatches?: VIAProblemMatch[];
    maxDisplay?: number;
}

export function QuickActionCard({
    viaProblemMatches,
    maxDisplay = 2
}: QuickActionCardProps) {
    if (!viaProblemMatches || viaProblemMatches.length === 0) {
        return null;
    }

    const displayMatches = viaProblemMatches.slice(0, maxDisplay);

    return (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-amber-900 dark:text-amber-100">
                    ⚡ Hành Động Nhanh
                </CardTitle>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Phương pháp đặc biệt được thiết kế riêng cho điểm mạnh của bạn
                </p>
            </CardHeader>

            <CardContent className="space-y-3">
                {displayMatches.map((match, idx) => {
                    // Parse intervention ID to extract strength name
                    // Format: "High_D + Creativity" or similar
                    const strengthMatch = match.id.match(/\+\s*(\w+)/);
                    const strengthName = strengthMatch ? strengthMatch[1] : 'Điểm mạnh của bạn';

                    return (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50 space-y-3 hover:shadow-md transition-shadow"
                        >
                            {/* Header with Strength Badge */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-amber-500 text-white text-xs px-2 py-0.5">
                                            <Star className="h-3 w-3 mr-1 inline" />
                                            {strengthName}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 text-xs px-2 py-0.5"
                                        >
                                            Hiệu quả: {(match.expected_effect * 100).toFixed(0)}%
                                        </Badge>
                                    </div>

                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                        {match.intervention.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h4>
                                </div>
                            </div>

                            {/* Technique Description */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                    💡 Kỹ Thuật:
                                </p>
                                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                    {match.technique}
                                </p>
                            </div>

                            {/* Mechanism (How it Works) */}
                            {match.mechanism && (
                                <div className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                            Cách thức hoạt động:
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {match.mechanism}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md group"
                            >
                                Bắt Đầu Ngay
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    );
                })}

                {/* Show Total Count */}
                {viaProblemMatches.length > maxDisplay && (
                    <div className="text-center pt-2">
                        <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                            +{viaProblemMatches.length - maxDisplay} phương pháp khác được thiết kế riêng cho bạn
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
