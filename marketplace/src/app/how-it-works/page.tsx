import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Eye, 
  ShieldCheck, 
  Camera, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | Book Hoardings',
  description: 'Understand the simple 4-step workflow to book verified billboards and hoardings across India.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Discover Prime Billboard Sites',
      desc: 'Browse hundreds of verified hoardings across Mumbai, Bengaluru, Delhi NCR, and other major hubs. Filter by city, arterial flyover, dimensions, illumination, and pricing.',
    },
    {
      num: '02',
      icon: Eye,
      title: 'Inspect Audited Site Details',
      desc: 'Every listing features high-resolution day and night photographs, vehicular traffic counts, orientation facing, and verified municipal licensing permits.',
    },
    {
      num: '03',
      icon: Lock,
      title: 'Reserve with Escrow Protection',
      desc: 'Lock in your campaign dates with our 100% Escrow security. Your media funds are safely held and only released to the media owner after successful mounting.',
    },
    {
      num: '04',
      icon: Camera,
      title: 'Get Geo-Tagged Photo Proof',
      desc: 'Within 24 hours of mounting, receive high-resolution daytime and illuminated night photographs with embedded GPS coordinates and date stamps in your dashboard.',
    },
  ];

  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Transparent OOH Workflow
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight">
            How Book Hoardings Works
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            A frictionless, technology-first process designed to make billboard buying transparent, reliable, and verified from search to display.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4 hover:border-zinc-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#B00020] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-semibold text-zinc-300 font-mono">
                    {s.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Guarantee Banner */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                The Verified Partner Guarantee
              </h2>
              <p className="text-xs text-zinc-500">
                Protecting your advertising investment every step of the flight.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-zinc-900">Direct Media Owner Rates</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Zero arbitrary markups. You negotiate directly with vetted asset owners at official rate-card values.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-zinc-900">No Risk of Phantom Sites</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every site is physically surveyed and validated for municipal permits and structural safety.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-zinc-900">Guaranteed Proof or 100% Refund</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                If photo proof is delayed or unfulfilled, your escrow deposit is instantly refunded in full.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-zinc-900">
            Ready to find prime advertising spaces?
          </h3>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Explore All Hoardings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

