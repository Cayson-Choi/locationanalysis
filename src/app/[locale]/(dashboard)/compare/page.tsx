'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GitCompare, MapPin, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ComparisonTable } from '@/components/compare/ComparisonTable';
import { RadarChart } from '@/components/compare/RadarChart';
import { StreamingText } from '@/components/ai/StreamingText';
import { useAIStream } from '@/hooks/useAIStream';

interface LocationInput {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
}

export default function ComparePage() {
  const t = useTranslations('compare');
  const [locations, setLocations] = useState<LocationInput[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ]);
  const [results, setResults] = useState<null | Record<string, unknown>>(null);
  const [loading, setLoading] = useState(false);
  const { text, isStreaming, startStream } = useAIStream();

  const addLocation = () => {
    if (locations.length >= 3) return;
    setLocations([...locations, { id: Date.now(), name: '' }]);
  };

  const removeLocation = (id: number) => {
    if (locations.length <= 2) return;
    setLocations(locations.filter((l) => l.id !== id));
  };

  const updateLocation = (id: number, name: string) => {
    setLocations(locations.map((l) => (l.id === id ? { ...l, name } : l)));
  };

  const handleCompare = async () => {
    const validLocations = locations.filter((l) => l.name.trim());
    if (validLocations.length < 2) return;

    setLoading(true);
    // In production: fetch analysis for each location and compare
    // For now, show the AI comparison
    await startStream('/api/ai/recommend', {
      locationName: validLocations.map((l) => l.name).join(' vs '),
      radius: 500,
      businesses: [],
      totalBusinesses: 0,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitCompare className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Location Inputs */}
      <Card>
        <CardContent className="space-y-3 p-4">
          {locations.map((loc, i) => (
            <div key={loc.id} className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0">
                {i + 1}
              </Badge>
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                placeholder={`위치 ${i + 1} (예: 강남역)`}
                value={loc.name}
                onChange={(e) => updateLocation(loc.id, e.target.value)}
              />
              {locations.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeLocation(loc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            {locations.length < 3 && (
              <Button variant="outline" size="sm" onClick={addLocation}>
                <Plus className="mr-1 h-4 w-4" />
                {t('addLocation')}
              </Button>
            )}
            <Button
              className="ml-auto"
              onClick={handleCompare}
              disabled={loading || isStreaming || locations.filter((l) => l.name.trim()).length < 2}
            >
              {loading || isStreaming ? '분석 중...' : t('compareButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Result */}
      {(text || isStreaming) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('aiJudgement')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StreamingText text={text} isStreaming={isStreaming} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
