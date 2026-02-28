'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/ai/ScoreGauge';
import { StreamingText } from '@/components/ai/StreamingText';
import { useAIStream } from '@/hooks/useAIStream';
import { useMapStore } from '@/stores/mapStore';

interface Recommendation {
  rank: number;
  businessType: string;
  score: number;
  rationale: string[];
  risks: string[];
  targetCustomers: string;
  estimatedMonthlyRevenue: { min: number; max: number };
  competitionLevel: string;
}

export default function RecommendPage() {
  const t = useTranslations('recommend');
  const { selectedLocation, selectedLocationName, radius } = useMapStore();
  const [preferences, setPreferences] = useState('');
  const [budget, setBudget] = useState('');
  const { text, isStreaming, error, data, startStream } = useAIStream();

  const handleSubmit = async () => {
    if (!selectedLocation) return;

    await startStream('/api/ai/recommend', {
      locationName: selectedLocationName || '선택 위치',
      radius,
      businesses: [],
      totalBusinesses: 0,
      preferences: preferences || undefined,
      budget: budget || undefined,
    });
  };

  const recommendations = (data as { recommendations?: Recommendation[] })?.recommendations;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
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
              <Badge variant="secondary" className="ml-auto">{radius}m</Badge>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('preferences')}</Label>
              <Input
                placeholder="예: 음식점, 카페"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('budget')}</Label>
              <Input
                placeholder={t('budgetPlaceholder')}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isStreaming || !selectedLocation}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isStreaming ? '분석 중...' : t('getRecommendations')}
          </Button>
        </CardContent>
      </Card>

      {/* Streaming Result */}
      {(text || isStreaming) && !recommendations && (
        <Card>
          <CardContent className="p-4">
            <StreamingText text={text} isStreaming={isStreaming} />
          </CardContent>
        </Card>
      )}

      {/* Parsed Recommendations */}
      {recommendations && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <Card key={rec.rank} className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">#{rec.rank}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{rec.businessType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-center">
                  <ScoreGauge score={rec.score} size={100} label={t('score')} />
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('rationale')}</p>
                  <ul className="mt-1 space-y-0.5">
                    {rec.rationale.map((r, i) => (
                      <li key={i} className="text-xs">• {r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('risks')}</p>
                  <ul className="mt-1 space-y-0.5">
                    {rec.risks.map((r, i) => (
                      <li key={i} className="text-xs text-destructive">• {r}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">{t('competitionLevel')}</p>
                    <Badge variant="outline" className="mt-0.5">
                      {rec.competitionLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('targetCustomers')}</p>
                    <p className="mt-0.5">{rec.targetCustomers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
