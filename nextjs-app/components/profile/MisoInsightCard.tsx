// FILE: nextjs-app/components/profile/MisoInsightCard.tsx
import { useState } from 'react';


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MisoAnalysisResult } from "@/types/miso-v3";
import { Brain, Shield, AlertTriangle, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MisoInsightCard({ analysis }: { analysis?: MisoAnalysisResult }) {
  // State for demo mode
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo Data for visualization
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
    predictions: undefined,
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
    via_analysis: undefined,
    interventions: { immediate: [], short_term: [], long_term: [], avoid: [], communication_style: 'value_focused', framing: 'plan_oriented' },
    summary: 'Demo Analysis'
  };

  // Use real analysis if available, otherwise check demo mode
  const activeAnalysis = analysis?.scores ? analysis : (isDemoMode ? demoAnalysis : null);

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
                Các bài test cần thiết: ✅ DASS-21 (bắt buộc) + Big Five + VIA + MBTI
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { BVS, RCS } = activeAnalysis.scores!;
  const profile = activeAnalysis.profile as any;
  const discrepancies = activeAnalysis.discrepancies || [];

  // Risk level styling
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
    <Card className="mb-6 border-l-4 border-l-purple-500 shadow-md overflow-hidden">
      <CardHeader className="bg-slate-50/50 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl text-purple-900">
          <Brain className="h-6 w-6 text-purple-600" />
          Phân Tích Chuyên Sâu (MISO V3)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* 1. Profile Identity */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white border rounded-xl shadow-sm gap-4">
          <div>
            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
              {profile.name}
              <span className="text-sm font-normal text-slate-500">({profile.id})</span>
            </h3>
            <p className="text-sm text-slate-600 mt-1">{profile.mechanism}</p>
          </div>
          <Badge variant={getRiskColor(profile.risk_level) as any} className="text-sm px-3 py-1 shrink-0">
            Risk: {profile.risk_level}
          </Badge>
        </div>

        {/* 2. BVS vs RCS Scale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-xl bg-red-50/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-semibold text-red-700 text-sm">Điểm Tổn Thương (BVS)</span>
              </div>
              <p className="text-xs text-slate-500">Nguy cơ chịu ảnh hưởng tiêu cực</p>
            </div>
            <div className="text-3xl font-bold text-red-600">{BVS.toFixed(3)}</div>
          </div>

          <div className="p-4 border rounded-xl bg-green-50/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-700 text-sm">Điểm Kiên Cường (RCS)</span>
              </div>
              <p className="text-xs text-slate-500">Năng lực phục hồi & bảo vệ</p>
            </div>
            <div className="text-3xl font-bold text-green-600">{RCS.toFixed(3)}</div>
          </div>
        </div>

        {/* 3. Discrepancies Alerts */}
        {discrepancies.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" /> Tín hiệu cần chú ý:
            </h4>
            {discrepancies.map((disc, idx) => (
              <Alert key={idx} variant="default" className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 font-bold text-sm">
                  {disc.name}
                </AlertTitle>
                <AlertDescription className="text-amber-900/80 text-xs mt-1">
                  {disc.interpretation}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
