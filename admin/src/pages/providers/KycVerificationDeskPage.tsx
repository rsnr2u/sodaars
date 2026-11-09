import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Check
} from 'lucide-react';
import { mockProviders } from '../../data/mockAdminData';
import { ProviderItem } from '../../types';

export const KycVerificationDeskPage: React.FC = () => {
  const [providers, setProviders] = useState<ProviderItem[]>(mockProviders);
  const [filter, setFilter] = useState<'all' | 'under_review' | 'verified' | 'rejected'>('under_review');
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(
    mockProviders.find((p) => p.kycStatus === 'under_review') || null
  );
  const [reviewNote, setReviewNote] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const filteredProviders = providers.filter((p) => {
    if (filter === 'all') return true;
    return p.kycStatus === filter;
  });

  const handleApprove = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, kycStatus: 'verified' } : p))
    );
    if (selectedProvider?.id === id) {
      setSelectedProvider({ ...selectedProvider, kycStatus: 'verified' });
    }
    setActionSuccessMessage(`KYC approved for ${selectedProvider?.name}. Media assets are now verified for discovery.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleReject = (id: string) => {
    if (!reviewNote) {
      alert('Please specify a rejection reason for the provider.');
      return;
    }
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, kycStatus: 'rejected' } : p))
    );
    if (selectedProvider?.id === id) {
      setSelectedProvider({ ...selectedProvider, kycStatus: 'rejected' });
    }
    setActionSuccessMessage(`Application rejected with note: "${reviewNote}"`);
    setReviewNote('');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRequestResubmission = (id: string) => {
    if (!reviewNote) {
      alert('Please state which documents need resubmission.');
      return;
    }
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, kycStatus: 'pending_resubmission' } : p))
    );
    setActionSuccessMessage(`Resubmission request sent to provider.`);
    setReviewNote('');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              KYC & Statutory Verification Desk
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
              COMPLIANCE AUDIT
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Review GSTIN certificates, PAN declarations, and municipal trade licenses before onboarding outdoor media inventory.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-zinc-200 text-xs font-mono">
          {(['under_review', 'verified', 'rejected', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === t
                  ? 'bg-zinc-900 text-white font-bold'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Two-Pane Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 spans): Submission List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Provider Applications ({filteredProviders.length})
            </span>
            <span className="text-xs text-zinc-400 font-mono">Sorted by urgency</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredProviders.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs font-mono">
                No submissions matching filter criteria.
              </div>
            ) : (
              filteredProviders.map((prov) => {
                const isSelected = selectedProvider?.id === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 shadow-xs ring-1 ring-orange-500'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm leading-tight">{prov.name}</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{prov.city}, {prov.state} • {prov.tier}</p>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          prov.kycStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prov.kycStatus === 'under_review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prov.kycStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-zinc-500 font-mono text-[11px]">
                      <span>GSTIN: {prov.gstin}</span>
                      <span>{prov.resourceCount} hoardings</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 spans): Detailed Dossier & Document Inspection */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6">
          {selectedProvider ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-orange-600">
                    DOSSIER AUDIT • {selectedProvider.id}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950 mt-1">{selectedProvider.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Legal Name: <strong className="text-zinc-800">{selectedProvider.legalEntity}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 block">Current Status</span>
                  <span
                    className={`inline-block mt-0.5 text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                      selectedProvider.kycStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedProvider.kycStatus === 'under_review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {selectedProvider.kycStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Statutory Tax IDs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 block font-mono">Declared GSTIN</span>
                  <span className="font-bold text-zinc-950 font-mono text-sm block mt-0.5">
                    {selectedProvider.gstin}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
                    ✓ Matched with GST Portal (Active Regular Taxpayer)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 block font-mono">Entity Permanent Account Number (PAN)</span>
                  <span className="font-bold text-zinc-950 font-mono text-sm block mt-0.5">
                    {selectedProvider.pan}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1 inline-block">
                    Status: Valid Fourth Character 'C/F/P'
                  </span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Uploaded Document Evidences
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border border-zinc-200 flex items-center justify-between hover:bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 block">GST Registration Certificate (Form REG-06)</span>
                        <span className="text-[11px] text-zinc-500 font-mono">PDF • 1.4 MB • Uploaded 3 days ago</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs flex items-center gap-1 font-mono">
                      <span>View PDF</span> <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-200 flex items-center justify-between hover:bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 block">Entity PAN Card Scan</span>
                        <span className="text-[11px] text-zinc-500 font-mono">JPG • 840 KB • Uploaded 3 days ago</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs flex items-center gap-1 font-mono">
                      <span>View Doc</span> <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-200 flex items-center justify-between hover:bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 block">Municipal Sky-Sign Trade License</span>
                        <span className="text-[11px] text-amber-700 font-mono">
                          {selectedProvider.docs.tradeLicense ? 'Verified' : 'Pending Upload from Provider'}
                        </span>
                      </div>
                    </div>
                    {selectedProvider.docs.tradeLicense ? (
                      <button className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs flex items-center gap-1 font-mono">
                        <span>View Doc</span> <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-mono font-medium">Missing File</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compliance Auditor Decision Box */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <label className="block text-xs font-bold text-zinc-800">
                  Auditor Remarks / Notice to Provider
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. All documents verified against Ministry of Corporate Affairs / GST portal. Approved."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(selectedProvider.id)}
                      className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleRequestResubmission(selectedProvider.id)}
                      className="px-3.5 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors"
                    >
                      Request Resubmission
                    </button>
                  </div>

                  <button
                    onClick={() => handleApprove(selectedProvider.id)}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Verify Provider</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-zinc-400 text-xs font-mono">
              Select a provider application from the queue to inspect documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
