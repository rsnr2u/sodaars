import Link from 'next/link';
import { ShieldCheck, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 text-slate-600 mt-auto">
      {/* Notice Banner */}
      <div className="border-b border-slate-200/60 bg-indigo-50/50 py-3.5 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-700">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <Info className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            <strong className="font-semibold text-slate-900">SODAARS Discovery Engine:</strong> SODAARS provides software for outdoor advertising media providers and a discovery directory for buyers. Inventory rates shown are indicative; final quotations, commercial contracts, and bookings are handled directly with each verified provider.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white text-base">
                S
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-lg">SODAARS</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              The premier SaaS operating platform and public discovery directory for outdoor advertising providers, hoardings, unipoles, and digital OOH screens.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-200/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Outdoor Media Providers Only</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Discovery</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-indigo-600 transition">
                  Explore Hoardings & DOOH
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-indigo-600 transition">
                  Verified Media Providers
                </Link>
              </li>
              <li>
                <Link href="/explore?category=STATIC" className="hover:text-indigo-600 transition">
                  Traditional Billboards & Unipoles
                </Link>
              </li>
              <li>
                <Link href="/explore?category=DIGITAL" className="hover:text-indigo-600 transition">
                  Digital LED Screens (DOOH)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">For Media Providers</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition"
                >
                  Provider SaaS Portal
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5173/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition"
                >
                  Provider Login
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5173/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition"
                >
                  Register Media Business
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200/80 pt-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SODAARS Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Direct Provider Connectivity</span>
            <span>Zero Booking Commission</span>
            <span>Verified Identity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
