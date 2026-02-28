'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bookmark, Trash2, FileText, Sparkles, ClipboardCheck, GitCompare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Link } from '@/i18n/navigation';
import { formatRelativeDate } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import type { Report, ReportType } from '@/types/database';

const typeIcons: Record<ReportType, typeof FileText> = {
  district: FileText,
  recommend: Sparkles,
  feasibility: ClipboardCheck,
  compare: GitCompare,
};

const typeColors: Record<ReportType, string> = {
  district: 'bg-blue-500/10 text-blue-500',
  recommend: 'bg-purple-500/10 text-purple-500',
  feasibility: 'bg-green-500/10 text-green-500',
  compare: 'bg-amber-500/10 text-amber-500',
};

export default function SavedPage() {
  const t = useTranslations('saved');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.data || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/reports/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r.id !== deleteId));
        toast.success('리포트가 삭제되었습니다');
      }
    } catch {
      toast.error('삭제에 실패했습니다');
    } finally {
      setDeleteId(null);
    }
  }

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter((r) => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">{t('filterAll')}</TabsTrigger>
          <TabsTrigger value="district">{t('filterAnalysis')}</TabsTrigger>
          <TabsTrigger value="recommend">{t('filterRecommend')}</TabsTrigger>
          <TabsTrigger value="feasibility">{t('filterFeasibility')}</TabsTrigger>
          <TabsTrigger value="compare">{t('filterCompare')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32 p-4" />
            </Card>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-20 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">{t('noReports')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => {
            const Icon = typeIcons[report.type];
            return (
              <Card key={report.id} className="group relative">
                <Link href={report.type === 'district' ? `/analysis/${report.id}` : `/saved`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={typeColors[report.type]}>
                        <Icon className="mr-1 h-3 w-3" />
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(report.created_at)}
                      </span>
                    </div>
                    <CardTitle className="text-sm">{report.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {report.location_name}
                    </CardDescription>
                  </CardHeader>
                </Link>
                <CardContent className="pt-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => setDeleteId(report.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>리포트 삭제</DialogTitle>
            <DialogDescription>{t('deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
