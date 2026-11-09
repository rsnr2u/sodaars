import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Book Hoardings',
  description: 'Privacy Policy and data protection practices for Book Hoardings advertisers and media partners.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xs">
        
        <div className="space-y-2 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B00020] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400">
            Last Updated: November 01, 2026 • Effective Immediately
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">1. Information We Collect</h2>
            <p>
              When you use Book Hoardings (operated under the SODAARS digital network), we collect information necessary to facilitate outdoor billboard discovery, booking reservations, contract execution, and verified escrow transactions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li><strong>Account Information:</strong> Name, work email address, telephone number, company/agency name, and registered GSTIN.</li>
              <li><strong>Campaign Data:</strong> Target cities, preferred hoarding locations, creative dimensions, flight schedules, and mounting specifications.</li>
              <li><strong>Billing & Escrow Records:</strong> Payment transaction references, escrow disbursement logs, and tax invoices. We do not store raw credit card credentials; all financial processing complies with RBI and PCI-DSS standards.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">2. How We Use Your Information</h2>
            <p>
              Your data is utilized solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li>Facilitating direct communication between you and pre-vetted Verified Partners.</li>
              <li>Generating legal rental agreements, proof-of-posting certificates, and GST-compliant tax invoices.</li>
              <li>Sending automated campaign updates, such as photo proof uploads and flight expiry alerts.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">3. Geo-Tagged Photos & Intellectual Property</h2>
            <p>
              Photographs submitted by media partners as proof of posting are used strictly to audit and verify campaign execution. Creative artworks uploaded by advertisers remain the exclusive intellectual property of the advertiser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">4. Data Security</h2>
            <p>
              We implement industry-grade encryption (TLS 1.3, AES-256) across all data transmissions and database storage. Access to advertiser campaign data is strictly restricted to authorized operations personnel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900">5. Contact Our Data Protection Officer</h2>
            <p>
              For privacy queries or data deletion requests, contact our legal desk at <a href="mailto:privacy@bookhoardings.com" className="text-[#B00020] hover:underline font-medium">privacy@bookhoardings.com</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

