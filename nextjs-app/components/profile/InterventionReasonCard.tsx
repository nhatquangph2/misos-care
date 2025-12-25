"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Target,
    Sparkles,
    Brain,
    Battery,
    TrendingUp,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { useState } from "react";

interface ScoredIntervention {
    intervention: {
        type: string;
        name: string;
        description: string;
        evidence_level?: 'A' | 'B' | 'C';
        energy_required?: 'low' | 'medium' | 'high';
        time_commitment?: string;
        steps?: string[];
    };
    score: number;
    reasoning: string[];
    rank: number;
}

interface InterventionReasonCardProps {
    interventions: ScoredIntervention[];
    maxDisplay?: number;
}

export function InterventionReasonCard({
    interventions,
    maxDisplay = 3
}: InterventionReasonCardProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    if (!interventions || interventions.length === 0) {
        return null;
    }

    const displayInterventions = interventions.slice(0, maxDisplay);

    const getEvidenceBadgeColor = (level?: string) => {
        switch (level) {
            case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200';
            case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
            case 'C': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200';
        }
    };

    const getEnergyIcon = (energy?: string) => {
        if (energy === 'low') return { icon: Battery, color: 'text-green-600' };
        if (energy === 'medium') return { icon: Battery, color: 'text-yellow-600' };
        return { icon: Battery, color: 'text-red-600' };
    };

    return (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-purple-900 dark:text-purple-100">
                    🎯 Giải Thích Chi Tiết
                </CardTitle>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Tại sao những phương pháp này phù hợp với bạn?
                </p>
            </CardHeader>

            <CardContent className="space-y-3">
                {displayInterventions.map((item, idx) => {
                    const isExpanded = expandedIndex === idx;
                    const EnergyIcon = getEnergyIcon(item.intervention.energy_required).icon;
                    const energyColor = getEnergyIcon(item.intervention.energy_required).color;

                    return (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-800/50 overflow-hidden"
                        >
                            {/* Header */}
                            <div
                                className="p-4 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        {/* Rank Badge */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-purple-600 text-white text-xs px-2 py-0.5">
                                                #{item.rank}
                                            </Badge>
                                            {item.intervention.evidence_level && (
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs px-2 py-0.5 ${getEvidenceBadgeColor(item.intervention.evidence_level)}`}
                                                >
                                                    Bằng chứng: {item.intervention.evidence_level}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Intervention Name */}
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                                            {item.intervention.name}
                                        </h4>

                                        {/* Score Bar */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 h-2 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${item.score * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 min-w-[3rem] text-right">
                                                {(item.score * 100).toFixed(0)}%
                                            </span>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            {item.intervention.energy_required && (
                                                <span className="flex items-center gap-1">
                                                    <EnergyIcon className={`h-3 w-3 ${energyColor}`} />
                                                    {item.intervention.energy_required === 'low' ? 'Ít năng lượng' :
                                                        item.intervention.energy_required === 'medium' ? 'Trung bình' : 'Nhiều năng lượng'}
                                                </span>
                                            )}
                                            {item.intervention.time_commitment && (
                                                <span>• {item.intervention.time_commitment}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    <div className="flex-shrink-0">
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-purple-600" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-purple-600" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-4 border-t border-purple-100 dark:border-purple-900/30 pt-4">
                                    {/* Description */}
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {item.intervention.description}
                                        </p>
                                    </div>

                                    {/* Reasoning Breakdown */}
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Tại Sao Phù Hợp Với Bạn:
                                        </h5>
                                        <div className="space-y-1.5">
                                            {item.reasoning.map((reason, reasonIdx) => (
                                                <div
                                                    key={reasonIdx}
                                                    className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Steps */}
                                    {item.intervention.steps && item.intervention.steps.length > 0 && (
                                        <div className="space-y-2">
                                            <h5 className="text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1">
                                                <Target className="h-3.5 w-3.5" />
                                                Cách Thực Hiện:
                                            </h5>
                                            <ol className="space-y-1.5 pl-4">
                                                {item.intervention.steps.map((step, stepIdx) => (
                                                    <li
                                                        key={stepIdx}
                                                        className="text-xs text-slate-700 dark:text-slate-300 list-decimal"
                                                    >
                                                        {step}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    <Button
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
                                    >
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Bắt Đầu Ngay
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Show More Hint */}
                {interventions.length > maxDisplay && (
                    <div className="text-center">
                        <p className="text-xs text-purple-600 dark:text-purple-400 italic">
                            +{interventions.length - maxDisplay} phương pháp khác được đề xuất
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
