'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ClipboardCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/ai/ScoreGauge';
import { SWOTMatrix } from '@/components/ai/SWOTMatrix';
import { StreamingText } from '@/components/ai/StreamingText';
import { useAIStream } from '@/hooks/useAIStream';
import { useMapStore } from '@/stores/mapStore';
import { formatKoreanNumber } from '@/lib/utils/formatters';

export default function FeasibilityPage() {
  const t = useTranslations('feasibility');
  const { selectedLocation, selectedLocationName, radius } = useMapStore();
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [investment, setInvestment] = useState('');
  const { text, isStreaming, error, data, startStream } = useAIStream();

  const handleSubmit = async () => {
    if (!selectedLocation || !businessType) return;

    await startStream('/api/ai/feasibility', {
      locationName: selectedLocationName || '선택 위치',
      radius,
      businessType,
      businesses: [],
      totalBusinesses: 0,
      sameTypeCount: 0,
      businessName: businessName || undefined,
      investment: investment || undefined,
    });
  };

  const result = data as {
    successRate?: number;
    confidence?: string;
    swot?: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
    pros?: Array<{ reason: string; evidence: string }>;
    cons?: Array<{ reason: string; evidence: string }>;
    breakEvenMonths?: number;
    revenueScenarios?: { pessimistic: number; realistic: number; optimistic: number };
    keySuccessFactors?: string[];
    actionItems?: string[];
  } | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Input Form */}
      <Card>
        <CardContent className="space-y-4 p-4">
          {selectedLocation && (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{selectedLocationName || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t('businessType')} *</Label>
              <Input
                placeholder={t('businessTypePlaceholder')}
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('businessName')}</Label>
              <Input
                placeholder="예: 마이카페"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('investment')}</Label>
              <Input
                placeholder="예: 5000만원"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isStreaming || !selectedLocation || !businessType}
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            {isStreaming ? '분석 중...' : t('startAnalysis')}
          </Button>
        </CardContent>
      </Card>

      {/* Streaming Result */}
      {(text || isStreaming) && !result && (
        <Card>
          <CardContent className="p-4">
            <StreamingText text={text} isStreaming={isStreaming} />
          </CardContent>
        </Card>
      )}

      {/* Parsed Result */}
      {result && (
        <div className="space-y-6">
          {/* Success Rate */}
          <div className="flex justify-center">
            <ScoreGauge
              score={result.successRate ?? 0}
              size={180}
              label={t('successRate')}
            />
          </div>

          {result.confidence && (
            <div className="text-center">
              <Badge variant="outline">
                {t('successRate')} 신뢰도: {result.confidence}
              </Badge>
            </div>
          )}

          {/* SWOT */}
          {result.swot && <SWOTMatrix data={result.swot} />}

          {/* Pros & Cons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">{t('prosTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.pros?.map((p, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-medium">{p.reason}</p>
                      <p className="text-xs text-muted-foreground">{p.evidence}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600">{t('consTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.cons?.map((c, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-medium">{c.reason}</p>
                      <p className="text-xs text-muted-foreground">{c.evidence}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Scenarios */}
          {result.revenueScenarios && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('revenueScenarios')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('pessimistic')}</p>
                    <p className="text-lg font-bold text-red-500">
                      {formatKoreanNumber(result.revenueScenarios.pessimistic)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('realistic')}</p>
                    <p className="text-lg font-bold">
                      {formatKoreanNumber(result.revenueScenarios.realistic)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('optimistic')}</p>
                    <p className="text-lg font-bold text-green-500">
                      {formatKoreanNumber(result.revenueScenarios.optimistic)}원
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* BEP + Key Factors */}
          <div className="grid gap-4 sm:grid-cols-2">
            {result.breakEvenMonths && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('breakEvenPoint')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{result.breakEvenMonths}개월</p>
                </CardContent>
              </Card>
            )}
            {result.keySuccessFactors && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('keySuccessFactors')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.keySuccessFactors.map((f, i) => (
                      <li key={i} className="text-sm">• {f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Items */}
          {result.actionItems && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('actionItems')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-1">
                  {result.actionItems.map((a, i) => (
                    <li key={i} className="text-sm">{a}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}
    </div>
  );
}
