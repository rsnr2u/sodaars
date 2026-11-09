import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | Book Hoardings',
  description: 'Transparent refund policy, escrow protection, and cancellation rules for billboard bookings.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xs">
        
        <div className="space-y-2 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B00020] uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" />
            <span>Escrow & Consumer Protection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-zinc-400">
            Last Updated: November 01, 2026 • 100% Escrow Backed
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">1. Escrow-Protected Guarantee</h2>
            <p>
              At Book Hoardings, our escrow system ensures that your campaign budget is held securely and never prematurely disbursed. If a media partner does not fulfill the confirmed booking, you are protected with a guaranteed refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">2. Cancellation Scenarios & Refund Tiers</h2>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="font-semibold text-zinc-900 text-xs block">
                  A. Cancellation 7+ Days Prior to Flight Start (Before Printing)
                </span>
                <p className="text-xs text-zinc-600">
                  <strong>100% Full Refund</strong> returned to your original payment method with zero cancellation penalty.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="font-semibold text-zinc-900 text-xs block">
                  B. Cancellation After Creative Flex Has Been Printed
                </span>
                <p className="text-xs text-zinc-600">
                  Full refund of the display rental fee. Only the actual, at-cost flex printing charge (if printing was requested) is deducted, and the printed banner is couriered to your office.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="font-semibold text-zinc-900 text-xs block">
                  C. Media Partner Non-Performance or Failed Mounting
                </span>
                <p className="text-xs text-zinc-600">
                  If the media partner fails to mount your advertisement or does not submit audited daytime and nighttime photo proof within 24 hours of flight start, you receive an <strong>automatic 100% refund</strong> from escrow.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">3. Illumination Outage & Display Disruptions</h2>
            <p>
              If a floodlit or digital billboard experiences electrical outage exceeding 48 consecutive hours during your flight, you are entitled to either:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li>A pro-rata cash refund for the affected days, OR</li>
              <li>An equivalent duration extension added to the end of your campaign flight at no charge.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">4. Refund Processing Timeline</h2>
            <p>
              Approved refunds are initiated immediately by our escrow operations desk and credited to your original bank account or corporate credit card within <strong>3 to 5 business days</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">5. Need to Request a Refund?</h2>
            <p>
              Submit your booking reference code to our escrow desk at <a href="mailto:escrow@bookhoardings.com" className="text-[#B00020] hover:underline font-medium">escrow@bookhoardings.com</a> or initiate a ticket directly through your account dashboard.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

