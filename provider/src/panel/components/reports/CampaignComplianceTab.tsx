import React, { useState, useMemo } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Moon,
  Search,
} from 'lucide-react';
import { CampaignComplianceRecord } from '../../types/report';

export interface CampaignComplianceTabProps {
  campaigns: CampaignComplianceRecord[];
}

export const CampaignComplianceTab: React.FC<CampaignComplianceTabProps> = ({ campaigns }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Calculated metrics
  const total = campaigns.length;
  const onTimeCount = campaigns.filter((c) => c.popSubmittedOnTime).length;
  const complianceRate = total > 0 ? (onTimeCount / total) * 100 : 0;
  const avgTurnaround =
    total > 0
      ? (campaigns.reduce((acc, c) => acc + c.mountingTurnaroundHours, 0) / total).toFixed(1)
      : '0';
  const nightProofCount = campaigns.filter((c) => c.hasNightIlluminationProof).length;
  const verifiedCount = campaigns.filter((c) => c.clientVerified).length;

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (statusFilter !== 'ALL' && c.executionStatus !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = c.campaignName.toLowerCase().includes(q);
        const matchesCust = c.customerName.toLowerCase().includes(q);
        const matchesResource = c.resourceName.toLowerCase().includes(q);
        const matchesId = c.campaignId.toLowerCase().includes(q);
        return matchesName || matchesCust || matchesResource || matchesId;
      }
      return true;
    });
  }, [campaigns, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. COMPLIANCE KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* POP SLA COMPLIANCE RATE */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Proof SLA Compliance
            </span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800 leading-none">
              {complianceRate.toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              SLA &le; 24h
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            {onTimeCount} of {total} proofs within SLA window
          </span>
        </div>

        {/* AVERAGE TURNAROUND TIME */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Mounting Turnaround
            </span>
            <Clock size={15} className="text-[#EA580C]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              {avgTurnaround}h
            </span>
            <span className="text-xs text-stone-500">Average</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Creative receipt to live display photo
          </span>
        </div>

        {/* NIGHT ILLUMINATION AUDIT */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Night Illumination Shots
            </span>
            <Moon size={15} className="text-indigo-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-900 leading-none">
              {nightProofCount}/{total}
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
              {((nightProofCount / total) * 100).toFixed(0)}% Audit
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Lighting operational verification
          </span>
        </div>

        {/* CLIENT SIGN-OFF COMPLIANCE */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Client Verified Proofs
            </span>
            <Camera size={15} className="text-blue-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              {verifiedCount}/{total}
            </span>
            <span className="text-xs text-stone-500">Accepted</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Zero client rejection or disputes
          </span>
        </div>
      </div>

      {/* 2. CAMPAIGN POP AUDIT LOG TABLE */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAF9]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search campaign, customer, resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Stage:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter campaigns by Execution Stage"
              className="h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All Execution Stages</option>
              <option value="In Execution">In Execution (Running)</option>
              <option value="Proof Submitted">Proof Submitted</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <th className="py-3 px-4">Campaign & Brand</th>
                <th className="py-3 px-4">Booked Asset & City</th>
                <th className="py-3 px-4">Flight Duration</th>
                <th className="py-3 px-4">Mounting Turnaround</th>
                <th className="py-3 px-4">POP Submission SLA</th>
                <th className="py-3 px-4">Proof Photos</th>
                <th className="py-3 px-4">Night Lighting</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.campaignId} className="hover:bg-[#FAFAF9]">
                  {/* CAMPAIGN */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#171717]">{camp.campaignName}</div>
                    <div className="text-[11px] text-[#737373]">
                      {camp.customerName} • {camp.companyName}
                    </div>
                  </td>

                  {/* ASSET */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#171717]">{camp.resourceName}</div>
                    <div className="text-[10px] text-[#737373]">{camp.city}</div>
                  </td>

                  {/* FLIGHT */}
                  <td className="py-3 px-4 whitespace-nowrap text-[#525252]">
                    {camp.startDate} to {camp.endDate}
                  </td>

                  {/* TURNAROUND */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-[#171717]">
                      {camp.mountingTurnaroundHours} hours
                    </div>
                    <span
                      className={`text-[9px] font-semibold px-1 rounded ${
                        camp.mountingTurnaroundHours <= 24
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {camp.mountingTurnaroundHours <= 24 ? 'Within Target' : 'Exceeded Target'}
                    </span>
                  </td>

                  {/* SLA STATUS */}
                  <td className="py-3 px-4">
                    {camp.popSubmittedOnTime ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 size={11} />
                        On-Time (&le;24h)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertCircle size={11} />
                        Delayed (&gt;24h)
                      </span>
                    )}
                  </td>

                  {/* PHOTO PROOFS */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                      <Camera size={13} className="text-[#EA580C]" />
                      <span>{camp.popPhotosCount} shots</span>
                    </div>
                  </td>

                  {/* NIGHT ILLUMINATION */}
                  <td className="py-3 px-4">
                    {camp.hasNightIlluminationProof ? (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200 flex items-center gap-1 w-max">
                        <Moon size={10} />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#737373] italic">Pending</span>
                    )}
                  </td>

                  {/* VERIFICATION */}
                  <td className="py-3 px-4 text-right">
                    {camp.clientVerified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                        Client Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        Under Review
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignComplianceTab;
