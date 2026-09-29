import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'SODAARS | Outdoor Advertising Directory & Inventory Discovery',
    template: '%s | SODAARS Outdoor Directory',
  },
  description:
    'Discover verified outdoor advertising providers, hoardings, unipoles, billboards, and digital OOH screens across India with verified visual proofs and indicative rates.',
  keywords: [
    'outdoor advertising',
    'hoardings',
    'billboards',
    'unipoles',
    'DOOH screens',
    'LED screen advertising',
    'OOH media directory',
    'SODAARS',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50/50 text-slate-900 selection:bg-indigo-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
