"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MisoAnalysisResult } from "@/types/miso-v3";
import { Brain, Shield, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CausalPathwayCard } from "@/components/profile/CausalPathwayCard";
import { InterventionReasonCard } from "@/components/profile/InterventionReasonCard";
import { QuickActionCard } from "@/components/profile/QuickActionCard";

// Helper to safely extract intervention type
const formatInterventionType = (intervention: any): string => {
  if (typeof intervention === 'string') return intervention.replace(/_/g, ' ');
  if (intervention && typeof intervention === 'object' && intervention.type) {
    return intervention.type.replace(/_/g, ' ');
  }
  return 'Hành động được đề xuất';
};

export function MisoInsightCard({ analysis }: { analysis?: MisoAnalysisResult }) {
  // State for demo mode
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReanalyze = async () => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/miso/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ include_history: true })
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const errorData = await res.json();
        console.error('Analysis failed:', errorData);
        alert(`Phân tích thất bại: ${errorData.details || errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Đã có lỗi xảy ra khi kết nối đến máy chủ.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ... (rest of the functions)
  const demoAnalysis: MisoAnalysisResult = {
    version: '3.0',
    timestamp: new Date().toISOString(),
    user_id: 'demo',
    completeness: { level: 'COMPLETE', mode: 'FULL_PLUS', confidence: 'HIGH', features: [], has: { dass: true, big5: true, via: true, mbti: true } },
    normalized: {},
    temporal: {},
    profile: {
      id: 'B3',
      name: 'Introverted Neurotic (Người nội tâm nhạy cảm)',
      risk_level: 'HIGH',
      mechanism: 'Cơ chế: Bạn có xu hướng suy nghĩ sâu sắc (Introverted) nhưng dễ bị ảnh hưởng bởi cảm xúc tiêu cực (Neurotic). Bạn thường tự trách mình và giữ nỗi buồn trong lòng.',
      interventions: [],
      flags: [],
      predicted_dass: { D: 'MODERATE', A: 'SEVERE', S: 'MILD' }
    },
    scores: { BVS: 0.65, RCS: -0.25 },
    predictions: { predictions: { D: 14, A: 16, S: 10 }, coefficients: { alpha: 10, beta1: 5, beta2: 3 }, segment: 'vn' },
    discrepancies: [
      {
        id: 'D5',
        name: 'Nụ cười che giấu (Smiling Depression)',
        severity: 'HIGH',
        interpretation: 'Bạn có điểm "Hope" cao nhưng điểm Trầm cảm cũng cao. Bạn đang cố gắng tỏ ra mạnh mẽ và lạc quan bên ngoài để che giấu nỗi đau bên trong.',
      },
      {
        id: 'D1',
        name: 'Căng thẳng cấp tính',
        severity: 'MODERATE',
        interpretation: 'Mức độ Stress hiện tại cao hơn nhiều so với tính cách gốc của bạn. Có vẻ bạn đang trải qua một biến cố hoặc áp lực lớn gần đây.',
      }
    ],
    via_analysis: {
      signature_strengths: [
        { strength: 'Creativity', name: 'Sáng tạo', percentile: 95, virtue: 'Wisdom', description: 'Khả năng nghĩ ra ý tưởng mới và độc đáo' },
        { strength: 'Perseverance', name: 'Kiên trì', percentile: 88, virtue: 'Courage', description: 'Hoàn thành điều bạn bắt đầu' },
        { strength: 'Hope', name: 'Hy vọng', percentile: 75, virtue: 'Transcendence', description: 'Kỳ vọng tốt nhất và làm việc để đạt được' },
      ],
      virtue_profile: [{ virtue: 'Wisdom', name: 'Trí tuệ', score: 82 }],
      protective_factors: [],
      risk_factors: [],
      build_strengths: [],
      interpretation: '',
      priority_intervention: null
    },
    mechanisms: {
      active: [
        {
          id: 'High_N',
          pathway: 'Độ lo âu cao (N↑) → Suy nghĩ quá mức → Trầm cảm và Lo âu',
          strength: 0.75,
          predictedDASS: { D: 8, A: 6, S: 5 }
        },
        {
          id: 'Low_E',
          pathway: 'Hướng nội (E↓) → Rút lui xã hội → Cô đơn → Trầm cảm',
          strength: 0.65,
          predictedDASS: { D: 5, A: 2 }
        }
      ],
      compensations: [
        {
          id: 'High_N_High_Hope',
          condition: 'N↑ + Hope↑',
          mechanism: 'Hy vọng cao giúp giảm ảnh hưởng của lo âu',
          strength: 'Hope',
          percentile: 75
        },
        {
          id: 'Low_E_High_Creativity',
          condition: 'E↓ + Creativity↑',
          mechanism: 'Sáng tạo biến sự cô đơn thành thời gian có ý nghĩa',
          strength: 'Creativity',
          percentile: 95
        }
      ],
      residual: {
        D: 3,
        A: 4,
        S: 2,
        interpretation: 'Mức độ căng thẳng thực tế cao hơn dự đoán dựa trên tính cách, cho thấy có yếu tố áp lực bên ngoài đang tác động.'
      },
      via_problem_matches: [
        {
          id: 'High_A_Creativity',
          intervention: 'creative_anxiety_management',
          technique: 'Vẽ lo âu của bạn như một nhân vật, đặt cho nó một giọng nói hài hước',
          mechanism: 'Khách quan hóa + Khoảng cách sáng tạo',
          expected_effect: 0.6
        },
        {
          id: 'High_D_Love_of_Learning',
          intervention: 'curiosity_activation',
          technique: 'Mỗi ngày học 1 điều mới về điều gì đó đẹp đẽ',
          mechanism: 'Tò mò làm gián đoạn suy nghĩ tiêu cực',
          expected_effect: 0.5
        }
      ]
    },
    interventions: {
      immediate: [
        {
          type: 'behavioral_activation',
          priority: 'HIGH',
          intervention: {
            type: 'behavioral_activation',
            name: 'Kích Hoạt Hành Vi (Behavioral Activation)',
            description: 'Lên lịch và thực hiện các hoạt động có ý nghĩa để tăng tâm trạng tích cực',
            evidence_level: 'A' as const,
            energy_required: 'low' as const,
            time_commitment: '15min',
            steps: [
              'Chọn 1 hoạt động sáng tạo bạn từng thích (vẽ, viết, làm đồ thủ công)',
              'Dành 15 phút mỗi ngày, không đánh giá kết quả',
              'Ghi lại cảm xúc trước và sau hoạt động'
            ]
          },
          score: 0.92,
          reasoning: [
            'Bằng chứng cấp A: Hiệu quả cao +0.30',
            'Nhắm vào cơ chế: E↓ → Trầm cảm +0.18',
            'Điểm mạnh Sáng tạo (95%) kích hoạt phương pháp này +0.15',
            'Phù hợp với phong cách INFP +0.15',
            'Yêu cầu năng lượng thấp, phù hợp với trạng thái hiện tại +0.10',
            'Xây dựng trên điểm mạnh Kiên trì hiện có +0.04'
          ],
          rank: 1
        }
      ],
      first_aid: [],
      short_term: [],
      long_term: [],
      avoid: [],
      communication_style: 'value_focused',
      framing: 'plan_oriented'
    },
    summary: 'Demo Analysis'
  };

  // Use real analysis if available (check for any meaningful data), otherwise check demo mode
  const hasRealData = analysis && (analysis.scores || analysis.via_analysis || analysis.profile);
  const activeAnalysis = hasRealData ? analysis : (isDemoMode ? demoAnalysis : null);

  // Show "waiting for data" state if no analysis yet
  if (!activeAnalysis) {
    return (
      <Card className="mb-6 border-l-4 border-l-purple-500 shadow-md overflow-hidden">
        <CardHeader className="bg-slate-50/50 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl text-purple-900">
            <Brain className="h-6 w-6 text-purple-600" />
            Phân Tích Chuyên Sâu (MISO V3)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-bold text-sm flex justify-between items-center">
              <span>Đang chờ dữ liệu phân tích</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDemoMode(true)}
                className="bg-white hover:bg-blue-100 text-blue-700 border-blue-300 h-8"
              >
                👁️ Xem thử kết quả mẫu
              </Button>
            </AlertTitle>
            <AlertDescription className="text-blue-900/80 text-xs mt-1">
              Hoàn thành các bài test (DASS-21, Big Five, VIA, MBTI) để xem phân tích MISO V3.
              <br />
              <span className="font-semibold mt-2 inline-block">
                Các bài test cần thiết: ✅ DASS-21 + Big Five (Các bài khác khuyến khích nhưng không bắt buộc)
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Safe access to scores with defaults
  const BVS = activeAnalysis.scores?.BVS ?? 0;
  const RCS = activeAnalysis.scores?.RCS ?? 0;
  const profile = activeAnalysis.profile as any; // Type assertion since profile structure varies
  const discrepancies = activeAnalysis.discrepancies || [];

  // Risk level styling helper
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      case 'VERY_LOW': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="mb-6 border-none shadow-lg overflow-hidden bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="bg-white/50 dark:bg-slate-900/50 pb-4 border-b border-purple-100 dark:border-purple-900/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="flex items-center gap-2 text-xl text-purple-900 dark:text-purple-100">
            <Brain className="h-6 w-6 text-purple-600" />
            Phân Tích Chuyên Sâu (MISO V3)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              {isAnalyzing ? 'Đang phân tích...' : 'Phân tích lại'}
            </Button>
            {profile.risk_level && (
              <Badge variant={getRiskColor(profile.risk_level) as any} className="text-xs uppercase px-2 py-0.5">
                Mức Độ: {profile.risk_level}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* 1. Profile Summary - Conversational Style */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-900/20">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
            🧠 Bạn thuộc nhóm: <span className="text-purple-600 dark:text-purple-400">"{profile.name || 'Chưa xác định'}"</span>
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {profile.mechanism || 'Chưa có thông tin chi tiết.'}
          </p>
        </div>

        {/* 2. Metrics Visualization - Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BVS - Vulnerability */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Độ Tổn Thương (Stress)
              </div>
              <span className="text-xs font-bold text-slate-500">{((BVS + 3) / 6 * 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(0, (BVS + 3) / 6 * 100))}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Khả năng bị ảnh hưởng bởi áp lực
            </p>
          </div>

          {/* RCS - Resilience */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400">
                <Shield className="h-4 w-4" />
                Năng Lực Phục Hồi
              </div>
              <span className="text-xs font-bold text-slate-500">{((RCS + 3) / 6 * 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(0, (RCS + 3) / 6 * 100))}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Sức mạnh nội tại bảo vệ bạn
            </p>
          </div>
        </div>

        {/* 2.5 VIA Strengths Analysis */}
        {activeAnalysis.via_analysis && activeAnalysis.via_analysis.signature_strengths && activeAnalysis.via_analysis.signature_strengths.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/20">
            <h3 className="font-bold text-lg text-amber-800 dark:text-amber-100 mb-4 flex items-center gap-2">
              🌟 Điểm Mạnh Đặc Trưng (Top 5)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeAnalysis.via_analysis.signature_strengths?.slice(0, 5).map((s, idx) => (
                <div key={idx} className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl border border-amber-200/50 flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 flex justify-between">
                      {s.name}
                      <span className="text-xs text-amber-600 font-normal">{s.percentile}%</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Thuộc đức tính: {s.virtue}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeAnalysis.via_analysis.virtue_profile && activeAnalysis.via_analysis.virtue_profile.length > 0 && (
              <div className="mt-4 pt-4 border-t border-amber-200/50">
                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <Shield className="w-4 h-4" />
                  <strong>Đức tính nổi trội:</strong> {activeAnalysis.via_analysis.virtue_profile[0].name} (TB: {activeAnalysis.via_analysis.virtue_profile[0].score}%)
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Discrepancies Alerts - Simplified */}
        {discrepancies.length > 0 && (
          <div className="space-y-3">
            {discrepancies.map((disc, idx) => (
              <div key={idx} className="flex gap-3 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-400">{disc.name}</h4>
                  <p className="text-xs text-red-700/80 dark:text-red-500/80 mt-1">{disc.interpretation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Causal Pathway Visualization */}
        {activeAnalysis.mechanisms && (
          <CausalPathwayCard mechanisms={activeAnalysis.mechanisms} />
        )}

        {/* 5. VIA-Problem Quick Actions */}
        {activeAnalysis.mechanisms?.via_problem_matches && (
          <QuickActionCard viaProblemMatches={activeAnalysis.mechanisms.via_problem_matches} />
        )}

        {/* 6. Intervention Reasoning (if scored interventions available) */}
        {activeAnalysis.interventions &&
          'immediate' in activeAnalysis.interventions &&
          Array.isArray(activeAnalysis.interventions.immediate) &&
          activeAnalysis.interventions.immediate.length > 0 &&
          (activeAnalysis.interventions.immediate as any[])[0]?.score !== undefined && (
            <InterventionReasonCard
              interventions={activeAnalysis.interventions.immediate as any}
              maxDisplay={3}
            />
          )}
      </CardContent>
    </Card>
  );
}
