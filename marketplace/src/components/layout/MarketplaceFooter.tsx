import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { POPULAR_CITIES } from '@/data/mockMarketplaceData';

export const MarketplaceFooter: React.FC = () => {
  return (
    <footer className="bg-[#141518] text-white border-t border-zinc-800/80 pt-16 pb-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Book Hoardings"
                className="h-9 w-auto brightness-0 invert object-contain"
              />
            </Link>

            <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-sm text-pretty">
              India&apos;s premier verified outdoor media platform. Direct partner rates, real-time live availability, and 100% escrow protection across 50+ metro hubs.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Powered by SODAARS Infrastructure Technology</span>
              </span>
            </div>
          </div>

          {/* Col 2: Top Metro Cities */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-semibold text-white">
              Top Metro Cities
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              {POPULAR_CITIES.map((c) => (
                <li key={c.name}>
                  <Link
                    href={`/explore?city=${encodeURIComponent(c.name)}`}
                    className="hover:text-white transition-colors"
                  >
                    Hoardings in {c.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/explore" className="text-rose-400 hover:underline font-medium flex items-center gap-1">
                  <span>Browse All 50+ Cities</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Help */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-semibold text-white">
              Resources & Help
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Industry Blog & Insights
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Interactive Map View
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Media Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Account */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-semibold text-white">
              Advertisers & Media
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Advertiser Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Profile & Campaigns
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Media Owner Portal
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Admin Operations Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Platform Integrity Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} BOOKHOARDINGS.COM • Verified Partner Network • All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 font-medium">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
