import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MarketplaceNavbar } from '@/components/layout/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/layout/MarketplaceFooter';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'BOOKHOARDINGS.COM | Book Hoardings, Billboards & DOOH Across India',
    template: '%s | BOOKHOARDINGS.COM',
  },
  description:
    'Search, inspect, and book verified outdoor advertising hoardings, unipoles, digital screens, and bridge panels across Mumbai, Bengaluru, Delhi NCR, Hyderabad, and Pune. 100% verified OOH inventory.',
  keywords: [
    'book hoardings online',
    'bookhoardings',
    'billboard advertising india',
    'DOOH advertising',
    'outdoor media booking',
    'hoardings in mumbai',
    'hoardings in bangalore',
    'hoardings in delhi',
    'unipole rental rates',
    'Verified Partner',
    'OOH marketplace',
    'media cart',
    'bulk hoarding booking',
  ],
  authors: [{ name: 'BOOKHOARDINGS.COM' }],
  creator: 'BOOKHOARDINGS Network',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'http://localhost:3000',
    siteName: 'BOOKHOARDINGS.COM',
    title: 'BOOKHOARDINGS.COM | Book Hoardings, Billboards & DOOH Across India',
    description:
      'Explore 1,240+ verified outdoor media assets. Transparent pricing, high-resolution Day/Night photos, and instant booking requests.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOOKHOARDINGS.COM | Outdoor Advertising Platform',
    description: 'Instant booking requests for prime billboards and DOOH across top metro cities.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BOOKHOARDINGS.COM',
              url: 'http://localhost:3000',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'http://localhost:3000/explore?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-zinc-50 text-zinc-900 antialiased font-sans`}>
        <CartProvider>
          <MarketplaceNavbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <MarketplaceFooter />
        </CartProvider>
      </body>
    </html>
  );
}
