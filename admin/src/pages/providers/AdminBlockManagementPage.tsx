import React, { useState } from 'react';
import { 
  Ban, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Plus, 
  Clock, 
  Unlock, 
  Lock,
  FileText
} from 'lucide-react';
import { mockResources } from '../../data/mockAdminData';
import { ResourceItem } from '../../types';

export const AdminBlockManagementPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(mockResources);
  const [showPlaceHoldModal, setShowPlaceHoldModal] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [holdType, setHoldType] = useState<ResourceItem['adminBlockStatus']>('municipal_hold');
  const [holdReason, setHoldReason] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const blockedResources = resources.filter((r) => r.adminBlockStatus !== 'none');
  const activeResources = resources.filter((r) => r.adminBlockStatus === 'none');

  const handleLiftHold = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              adminBlockStatus: 'none',
              blockReason: undefined,
              blockedBy: undefined,
              blockTimestamp: undefined,
            }
          : r
      )
    );
    setSuccessBanner(`Administrative hold lifted on site ${id}. Restored to active discovery.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleApplyHold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId || !holdReason) {
      alert('Please select a site and declare an official administrative hold reason.');
      return;
    }

    setResources((prev) =>
      prev.map((r) =>
        r.id === selectedResourceId
          ? {
              ...r,
              adminBlockStatus: holdType,
              blockReason: holdReason,
              blockTimestamp: 'Just now',
              blockedBy: 'Admin - Arunav Roy (Super Admin Desk)',
            }
          : r
      )
    );

    setShowPlaceHoldModal(false);
    setSelectedResourceId('');
    setHoldReason('');
    setSuccessBanner(`Administrative hold successfully enforced. Inventory quarantined from booking.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Admin Inventory Block Desk
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 font-semibold">
              {blockedResources.length} SITES RESTRICTED
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Impose and lift statutory, municipal, or compliance holds to prevent unauthorized booking of contested media sites.
          </p>
        </div>

        <button
          onClick={() => setShowPlaceHoldModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Place Site Under Admin Hold</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
          <span className="text-xs text-zinc-500 font-mono">Municipal Hold</span>
          <div className="text-2xl font-extrabold text-zinc-950">
            {resources.filter((r) => r.adminBlockStatus === 'municipal_hold').length}
          </div>
          <p className="text-[11px] text-zinc-400">Local municipal corporation notice or permit renewal pending</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
          <span className="text-xs text-zinc-500 font-mono">Compliance Hold</span>
          <div className="text-2xl font-extrabold text-zinc-950">
            {resources.filter((r) => r.adminBlockStatus === 'compliance_hold').length}
          </div>
          <p className="text-[11px] text-zinc-400">EXIF Geotag mismatch, audit discrepancy, or expired insurance</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
          <span className="text-xs text-zinc-500 font-mono">Legal Dispute Hold</span>
          <div className="text-2xl font-extrabold text-zinc-950">
            {resources.filter((r) => r.adminBlockStatus === 'legal_dispute').length}
          </div>
          <p className="text-[11px] text-zinc-400">Conflicting ownership claims or injunction notice</p>
        </div>
      </div>

      {/* Active Holds List */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="font-bold text-zinc-950 text-base">Active Administrative Quarantines</h3>
          <span className="text-xs text-zinc-400 font-mono">Inventory cannot be booked by any agency or buyer</span>
        </div>

        {blockedResources.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs font-mono">
            No media sites currently under administrative hold.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {blockedResources.map((item) => (
              <div key={item.id} className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-red-600 text-xs">{item.code}</span>
                    <h4 className="font-bold text-zinc-900 text-sm">{item.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold uppercase">
                      {item.adminBlockStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 bg-red-50/60 p-3 rounded-xl border border-red-100 leading-relaxed">
                    <strong>Official Hold Notice:</strong> {item.blockReason}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono">
                    <span>Provider: <strong className="text-zinc-700">{item.providerName}</strong></span>
                    <span>City: <strong className="text-zinc-700">{item.city}</strong></span>
                    <span>Hold Enforced: {item.blockTimestamp}</span>
                    <span>By: {item.blockedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
                  <button
                    onClick={() => handleLiftHold(item.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Lift Hold & Reactivate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Place Hold Modal */}
      {showPlaceHoldModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-zinc-950 text-base">Enforce Administrative Hold</h3>
              </div>
              <button onClick={() => setShowPlaceHoldModal(false)} className="text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyHold} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Select Media Site to Quarantine</label>
                <select
                  required
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-red-500 font-mono"
                >
                  <option value="">-- Choose active inventory resource --</option>
                  {activeResources.map((res) => (
                    <option key={res.id} value={res.id}>
                      [{res.code}] {res.title} - {res.providerName} ({res.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Hold Classification</label>
                <select
                  value={holdType}
                  onChange={(e) => setHoldType(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-red-500"
                >
                  <option value="municipal_hold">Municipal Hold (BMC/BBMP/GHMC Notice)</option>
                  <option value="compliance_hold">Compliance Hold (Audit Failure / Geotag Discrepancy)</option>
                  <option value="legal_dispute">Legal Dispute (Ownership or Title Contestation)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Statutory Notice / Document Reference & Justification
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Municipal notice #BMC/WZ/2026/04 issued regarding structural certificate renewal. Site halted until compliance confirmation."
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Administrative Impact
                </span>
                <p className="text-[11px] text-red-900/80">
                  This action immediately delists the site from buyer search results and prevents any new booking quotation from being issued.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowPlaceHoldModal(false)}
                  className="px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Enforce Quarantine Hold</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
