import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Award, 
  Users, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Book Hoardings',
  description: 'Learn about Book Hoardings, India’s transparent and verified outdoor advertising marketplace.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            About Book Hoardings
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 tracking-tight">
            Democratizing Outdoor Advertising Across India
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            We are building India&apos;s most reliable, transparent, and verified marketplace for outdoor billboards, unipoles, gantries, and digital DOOH screens.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
            <span className="text-3xl font-semibold text-[#B00020] block">1,240+</span>
            <span className="text-xs text-zinc-600 font-medium mt-1 block">Verified Hoardings</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
            <span className="text-3xl font-semibold text-zinc-900 block">18+</span>
            <span className="text-xs text-zinc-600 font-medium mt-1 block">Metro Hubs Covered</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
            <span className="text-3xl font-semibold text-emerald-600 block">100%</span>
            <span className="text-xs text-zinc-600 font-medium mt-1 block">Escrow Protected</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
            <span className="text-3xl font-semibold text-zinc-900 block">4.9/5</span>
            <span className="text-xs text-zinc-600 font-medium mt-1 block">Advertiser Rating</span>
          </div>
        </div>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">Our Mission</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
              Say goodbye to opaque pricing and unverified hoarding claims
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Traditional out-of-home (OOH) media buying has long suffered from middleman markups, phantom availability, and delayed proof-of-mounting photos.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Book Hoardings connects brands, agencies, and local businesses directly with pre-vetted media owners through our strict <strong>Verified Partner</strong> program. Every site features verified dimensions, GPS coordinates, audited traffic counts, and guaranteed escrow protection.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B00020] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">The Verified Partner Standard</h3>
            </div>
            <ul className="space-y-3 text-xs text-zinc-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Physical site audits and municipal permit verification before listing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Geo-tagged, date-stamped high-definition photos upon campaign mounting.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Transparent rate cards without hidden broker commissions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% Escrow security until printing and display execution are verified.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Ready to launch your outdoor advertising campaign?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Explore hundreds of verified billboard locations across Mumbai, Bengaluru, Delhi NCR, and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <span>Explore Hoardings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
            >
              Contact Our Media Desk
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

