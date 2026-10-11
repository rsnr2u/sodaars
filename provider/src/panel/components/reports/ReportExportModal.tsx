import React, { useState } from 'react';
import {
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { ReportDateRangePreset } from '../../types/report';
import { SAMPLE_OCCUPANCY_METRICS } from '../../data/sampleReports';

export interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTabLabel: string;
  selectedPreset: ReportDateRangePreset;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  activeTabLabel,
  selectedPreset,
}) => {
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeOccupancy, setIncludeOccupancy] = useState(true);
  const [includeCompliance, setIncludeCompliance] = useState(true);
  const [includeIncidents, setIncludeIncidents] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Build realistic CSV content
      const headers = [
        'Resource ID',
        'Asset Name',
        'Media Format',
        'City',
        'Area',
        'Dimensions',
        'Sq.Ft Area',
        'Total Days',
        'Occupied Days',
        'Vacant Days',
        'Occupancy Rate %',
        'Realized Revenue (INR)',
        'Rate Per SqFt',
        'Current Status',
      ];

      const rows = SAMPLE_OCCUPANCY_METRICS.map((m) => [
        m.resourceId,
        `"${m.resourceName}"`,
        m.resourceType,
        m.city,
        `"${m.area}"`,
        `"${m.dimensions}"`,
        m.sqftArea,
        m.totalDays,
        m.occupiedDays,
        m.vacantDays,
        `${m.utilizationPercent}%`,
        m.revenueGenerated,
        m.ratePerSqFt.toFixed(2),
        `"${m.currentStatus}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SODAARS_Report_${activeTabLabel.replace(/\s+/g, '_')}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      onClose();
    }, 600);
  };

  const handlePrintPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      window.print();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <Download size={18} className="text-[#EA580C]" />
          <div>
            <div className="text-sm font-bold text-[#171717]">Export Operational Report</div>
            <div className="text-[11px] text-[#737373] font-normal">
              Active Module: <strong>{activeTabLabel}</strong>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={exportFormat === 'CSV' ? <FileSpreadsheet size={13} /> : <Printer size={13} />}
            onClick={exportFormat === 'CSV' ? handleExportCSV : handlePrintPDF}
            disabled={isExporting}
          >
            {isExporting ? 'Generating...' : exportFormat === 'CSV' ? 'Download CSV File' : 'Print / Save as PDF'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* FORMAT SELECTION */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#171717]">
            1. Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExportFormat('CSV')}
              className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                exportFormat === 'CSV'
                  ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                  : 'border-[#E5E5E5] hover:bg-stone-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={16} />
              </div>
              <div>
                <div className="font-bold text-[#171717]">CSV / Excel Data</div>
                <div className="text-[10px] text-[#737373] mt-0.5">
                  Raw tabular figures for analysis and financial reconciliation.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('PDF')}
              className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                exportFormat === 'PDF'
                  ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                  : 'border-[#E5E5E5] hover:bg-stone-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center shrink-0">
                <Printer size={16} />
              </div>
              <div>
                <div className="font-bold text-[#171717]">Executive PDF / Print</div>
                <div className="text-[10px] text-[#737373] mt-0.5">
                  Formatted visual summary with KPI cards and company branding.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* INCLUSIONS */}
        <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#171717]">
            2. Sections to Include in Dataset
          </label>
          <div className="space-y-2 bg-[#FAFAF9] p-3 rounded-xl border border-[#E5E5E5]">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeOccupancy}
                onChange={(e) => setIncludeOccupancy(e.target.checked)}
                className="rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
              />
              <span className="font-medium text-[#171717]">Asset Occupancy & Display Days</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFinancials}
                onChange={(e) => setIncludeFinancials(e.target.checked)}
                className="rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
              />
              <span className="font-medium text-[#171717]">Financial Realization & Yield per Sq.Ft</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCompliance}
                onChange={(e) => setIncludeCompliance(e.target.checked)}
                className="rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
              />
              <span className="font-medium text-[#171717]">Proof of Performance (POP) SLA Compliance</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeIncidents}
                onChange={(e) => setIncludeIncidents(e.target.checked)}
                className="rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
              />
              <span className="font-medium text-[#171717]">Maintenance Downtime & Incident Logs</span>
            </label>
          </div>
        </div>

        {/* TIME PERIOD SUMMARY */}
        <div className="p-3 rounded-lg bg-orange-50/50 border border-orange-200/70 text-[11px] text-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[#EA580C]" />
            <span>Time Range: <strong>{selectedPreset.replace(/_/g, ' ')}</strong></span>
          </div>
          <span className="text-[#EA580C] font-bold uppercase text-[10px]">Verified Audit</span>
        </div>
      </div>
    </Modal>
  );
};

export default ReportExportModal;
