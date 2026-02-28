'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { BarChart3, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMapStore } from '@/stores/mapStore';
import { toast } from 'sonner';

export default function AnalysisPage() {
  const t = useTranslations('analysis');
  const router = useRouter();
  const { selectedLocation, selectedLocationName, radius } = useMapStore();
  const [loading, setLoading] = useState(false);
  const [addressInput, setAddressInput] = useState(selectedLocationName || '');

  const handleStartAnalysis = async () => {
    const lat = selectedLocation?.lat;
    const lng = selectedLocation?.lng;

    if (!lat || !lng) {
      toast.error('분석할 위치를 선택해주세요');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/analysis/district', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, radius }),
      });

      const data = await res.json();
      if (data.success) {
        // Save report
        const saveRes = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'district',
            title: `${addressInput || '선택 위치'} 상권 분석`,
            location_name: addressInput || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            latitude: lat,
            longitude: lng,
            radius,
            data: data.data,
          }),
        });

        const saved = await saveRes.json();
        if (saved.success && saved.data?.id) {
          router.push(`/analysis/${saved.data.id}`);
        } else {
          // Show inline result even if save fails
          toast.info('분석이 완료되었습니다 (저장은 로그인이 필요합니다)');
        }
      } else {
        toast.error(data.error || '분석에 실패했습니다');
      }
    } catch {
      toast.error('분석 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className="text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('selectLocation')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">위치 정보</CardTitle>
          <CardDescription>
            지도 탐색기에서 위치를 선택하거나 주소를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>주소 또는 위치명</Label>
            <Input
              placeholder="예: 강남역, 서울시 강남구..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
          </div>

          {selectedLocation && (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                선택된 위치: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label>분석 반경</Label>
            <p className="text-sm text-muted-foreground">{radius}m</p>
          </div>

          <Button
            className="w-full"
            onClick={handleStartAnalysis}
            disabled={loading}
          >
            {loading ? '분석 중...' : t('startAnalysis')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
