'use client';

import { useCallback } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReportPDFExportProps {
  reportTitle: string;
  contentElementId?: string;
}

export function ReportPDFExport({ reportTitle, contentElementId = 'report-content' }: ReportPDFExportProps) {
  const handleExport = useCallback(async () => {
    try {
      // Dynamic import for code splitting
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById(contentElementId);
      if (!element) {
        toast.error('내보낼 내용을 찾을 수 없습니다');
        return;
      }

      toast.info('PDF를 생성하고 있습니다...');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`${reportTitle}.pdf`);
      toast.success('PDF가 저장되었습니다');
    } catch (error) {
      toast.error('PDF 생성에 실패했습니다');
      console.error('PDF export error:', error);
    }
  }, [reportTitle, contentElementId]);

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      PDF
    </Button>
  );
}
