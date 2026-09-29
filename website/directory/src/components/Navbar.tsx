import Link from 'next/link';
import { Compass, Users, Layers, ExternalLink } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 shadow-sm shadow-indigo-500/20 text-white font-black text-lg">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg leading-tight">
                SODAARS
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
                Discovery Directory
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              href="/explore"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
            >
              <Compass className="h-4 w-4 text-indigo-600" />
              <span>Explore Inventory</span>
            </Link>
            <Link
              href="/providers"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Verified Providers</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-md hover:bg-slate-50 transition"
          >
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span>Map & Search</span>
          </Link>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            <span>Provider Portal</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
