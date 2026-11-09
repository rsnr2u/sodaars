import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Book Hoardings',
  description: 'Terms of service and billboard marketplace rules for Book Hoardings advertisers and media partners.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xs">
        
        <div className="space-y-2 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B00020] uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs text-zinc-400">
            Last Updated: November 01, 2026 • Applies to all bookings on Book Hoardings
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or reserving advertising media on Book Hoardings (and its affiliated platforms), you agree to be legally bound by these Terms and Conditions and all applicable municipal advertising laws in India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">2. Marketplace Role & Verified Partner Status</h2>
            <p>
              Book Hoardings functions as a technology platform connecting advertisers with pre-screened media owners (&quot;Verified Partners&quot;). While we conduct rigorous physical site audits and municipal permit checks, structural maintenance and display continuity remain the direct responsibility of the respective asset owner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">3. Escrow Protocol & Milestone Disbursement</h2>
            <p>
              All campaign payments are held securely in a regulated escrow mechanism. Funds are only released to the media owner after:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li>The media owner uploads verifiable daytime and illuminated night-time geo-tagged photographs confirming physical mounting.</li>
              <li>Our operations audit desk validates the photo proof against the scheduled flight start date.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">4. Advertising Content Guidelines</h2>
            <p>
              Advertisers are solely responsible for ensuring artwork complies with the Advertising Standards Council of India (ASCI) guidelines. Content that is defamatory, deceptive, unlawful, obscene, or promoting restricted goods under Indian law is strictly prohibited and subject to immediate cancellation without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">5. Force Majeure & Inclement Weather</h2>
            <p>
              Neither Book Hoardings nor the media partner shall be held liable for temporary display disruptions caused by severe cyclones, municipal structural orders, or government-mandated electoral blackouts. In such events, the campaign flight is extended by the equivalent disrupted days or reimbursed pro-rata.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

