'use client';

import { useState } from 'react';
import { X, Send, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { submitResourceLead, submitProviderLead, type LeadPayload } from '@/lib/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'resource' | 'provider';
  targetSlug: string;
  targetTitle: string;
  providerName: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  targetType,
  targetSlug,
  targetTitle,
  providerName,
}: ContactModalProps) {
  const [formData, setFormData] = useState<LeadPayload>({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    campaign_start_date: '',
    campaign_end_date: '',
    estimated_budget: undefined,
    message: '',
    hp_field: '', // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = targetType === 'resource'
        ? await submitResourceLead(targetSlug, formData)
        : await submitProviderLead(targetSlug, formData);

      if (res.success) {
        setSubmitted(true);
      } else {
        const firstError = res.errors ? Object.values(res.errors)[0]?.[0] : null;
        setErrorMessage(firstError || res.message || 'Failed to submit inquiry. Please check your inputs.');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Inquiry Transmitted Directly</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Your inquiry has been routed directly to <strong className="font-semibold text-slate-900">{providerName}</strong>. Their sales and media planning team will review your requirements and respond directly.
            </p>
            <div className="mt-6">
              <button
                onClick={onClose}
                className="inline-flex rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Shield className="h-4 w-4" />
                <span>Direct Provider Inquiry</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                Connect with {providerName}
              </h2>
              <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                Regarding: <span className="font-medium text-slate-800">{targetTitle}</span>
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 rounded-xl bg-rose-50 p-3.5 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (strictly offscreen anti-spam trap) */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                <input
                  type="text"
                  name="hp_field"
                  value={formData.hp_field}
                  onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    placeholder="e.g. Vikram Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Brand</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    placeholder="vikram@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Start</label>
                  <input
                    type="date"
                    value={formData.campaign_start_date}
                    onChange={(e) => setFormData({ ...formData, campaign_start_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campaign End</label>
                  <input
                    type="date"
                    value={formData.campaign_end_date}
                    onChange={(e) => setFormData({ ...formData, campaign_end_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.estimated_budget ?? ''}
                    onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
                    placeholder="₹ 75,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requirements / Message *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="Describe your desired campaign dates, creative specifications, or questions for the media provider..."
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-200/60 leading-relaxed">
                <span className="font-semibold text-slate-700">Direct Communication Notice:</span> SODAARS is a provider SaaS system and discovery directory. Your inquiry is delivered directly into the provider&apos;s Lead Inbox.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Transmitting Inquiry...' : 'Submit Inquiry Directly to Provider'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
