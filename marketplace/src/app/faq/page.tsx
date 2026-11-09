'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Search
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: 'General' | 'Booking & Escrow' | 'Printing & Proof' | 'Pricing';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'General',
    q: 'What is Book Hoardings and how does it work?',
    a: 'Book Hoardings is India’s first open outdoor advertising marketplace. We connect brand advertisers and agencies directly with verified media owners. You can browse live hoarding availability, check transparent pricing, reserve display slots, and track campaign execution with date-stamped, geo-tagged photo proofs.'
  },
  {
    category: 'Booking & Escrow',
    q: 'What does the "Verified Partner" badge mean?',
    a: 'Every media owner with a "Verified Partner" badge has undergone physical site inspection by our operations desk. We verify municipal advertising licenses, structural stability certificates, and legal ownership before any hoarding is published on our platform.'
  },
  {
    category: 'Booking & Escrow',
    q: 'How does the Escrow Payment protection safeguard my campaign budget?',
    a: 'When you book a hoarding, your funds are safely held in a regulated escrow account. The media owner receives payment only after our desk audits and approves the date-stamped, geo-tagged photo proof confirming your flex has been mounted correctly.'
  },
  {
    category: 'Printing & Proof',
    q: 'How do I know my banner has actually been mounted on time?',
    a: 'Our field inspection protocol requires media partners to upload daytime and illuminated night-time high-resolution photographs within 24 hours of mounting. Every photo contains embedded EXIF metadata (GPS latitude, longitude, and timestamp) that you can inspect in your account dashboard.'
  },
  {
    category: 'Printing & Proof',
    q: 'Are printing and rigging charges included in the listed price?',
    a: 'The base price displayed is for media space rental. You can opt to include high-grade front-lit/back-lit flex printing and professional rigging by simply toggling the printing option during checkout.'
  },
  {
    category: 'Pricing',
    q: 'Are billboard rental prices negotiable?',
    a: 'The prices listed on Book Hoardings represent direct partner rates with zero intermediary markups. For multi-site network campaigns or bookings exceeding 60 days, our media desk can provide customized package discounts.'
  },
  {
    category: 'General',
    q: 'What artwork formats are accepted for billboard printing?',
    a: 'We accept high-resolution CMYK artwork in TIFF, PDF, or CDR formats at 300 DPI (scaled 1:10 or 1:12). Our creative desk provides a free pre-flight print inspection to guarantee crisp visual output at massive scale.'
  },
  {
    category: 'Pricing',
    q: 'What is your refund policy if the media owner cancels or fails to mount?',
    a: 'If a media partner fails to mount your flex within the agreed flight start window, you receive an immediate 100% refund of your escrow deposit without any deductions.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'General', 'Booking & Escrow', 'Printing & Proof', 'Pricing'];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Help & Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Everything you need to know about booking hoardings, verified partner standards, escrow protection, and proof of posting.
          </p>
        </div>

        {/* Search Bar & Categories */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., escrow, proof, printing)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-zinc-200 text-xs font-medium text-zinc-900 bg-white shadow-xs focus:outline-none focus:border-[#B00020]"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#B00020] text-white shadow-xs'
                    : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-zinc-50/50"
                >
                  <span className="text-sm font-semibold text-zinc-900 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#B00020]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Still have questions?</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Our media planning experts are available to guide you through site selection and flight booking.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-2"
          >
            <span>Talk to an Expert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}

