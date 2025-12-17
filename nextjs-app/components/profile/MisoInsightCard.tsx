// FILE: nextjs-app/components/profile/MisoInsightCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MisoAnalysisResult } from "@/types/miso-v3";
import { Brain, Shield, AlertTriangle, Activity } from "lucide-react";

export function MisoInsightCard({ analysis }: { analysis?: MisoAnalysisResult }) {
  if (!analysis || !analysis.scores) return null;

  const { BVS, RCS } = analysis.scores;
  const profile = analysis.profile as any;
  const discrepancies = analysis.discrepancies || [];

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
                        <AlertTriangle className="h-4 w-4 text-red-500"/>
                        <span className="font-semibold text-red-700 text-sm">Điểm Tổn Thương (BVS)</span>
                    </div>
                    <p className="text-xs text-slate-500">Nguy cơ chịu ảnh hưởng tiêu cực</p>
                </div>
                <div className="text-3xl font-bold text-red-600">{BVS.toFixed(3)}</div>
            </div>

            <div className="p-4 border rounded-xl bg-green-50/30 flex items-center justify-between">
                <div>
                     <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-green-500"/>
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
                    <Activity className="h-4 w-4"/> Tín hiệu cần chú ý:
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
