import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export const metadata = {
  title: 'Outdoor Advertising Blog & Insights | Book Hoardings',
  description: 'Guides, industry reports, rate trends, and billboard advertising strategies across India.',
};

const BLOG_POSTS = [
  {
    slug: 'billboard-advertising-guide-mumbai-2026',
    title: 'The Complete Guide to Billboard Advertising in Mumbai: Prime Corridors & Rate Cards',
    excerpt: 'Detailed analysis of Western Express Highway, BKC, and Bandra arterial corridors with footfall data and rate benchmarks.',
    category: 'Market Guides',
    date: 'Nov 02, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'dooh-vs-static-billboards-india',
    title: 'Digital DOOH vs Traditional Static Hoardings: Which Delivers Better ROI in 2026?',
    excerpt: 'Comparing impression volume, creative flexibility, daytime illumination, and cost-per-thousand (CPM) across metro intersections.',
    category: 'Industry Insights',
    date: 'Oct 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'escrow-protection-revolution-ooh',
    title: 'How Escrow Protection and Geo-Tagged Proof of Posting Eliminate OOH Risk',
    excerpt: 'Why traditional payment models are obsolete and how automated milestone verification protects brand marketing budgets.',
    category: 'Best Practices',
    date: 'Oct 19, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'bengaluru-high-traffic-billboard-sites',
    title: 'Top 5 High-Impact Billboard Corridors in Bengaluru for Tech & D2C Brands',
    excerpt: 'Auditing Outer Ring Road, Indiranagar 100ft Road, and Electronic City flyovers for peak vehicular impressions.',
    category: 'City Focus',
    date: 'Oct 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
  },
];

export default function BlogPage() {
  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Insights & Guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight">
            Book Hoardings Knowledge Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Expert analysis, pricing benchmarks, and strategic playbooks for out-of-home (OOH) media campaigns.
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2 group hover:border-zinc-300 transition-all">
          <div className="relative aspect-[16/10] md:aspect-auto">
            <img
              src={BLOG_POSTS[0].image}
              alt={BLOG_POSTS[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-zinc-900 shadow-xs">
              {BLOG_POSTS[0].category}
            </span>
          </div>

          <div className="p-6 sm:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {BLOG_POSTS[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  {BLOG_POSTS[0].readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 leading-snug group-hover:text-[#B00020] transition-colors">
                {BLOG_POSTS[0].title}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {BLOG_POSTS[0].excerpt}
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B00020] group-hover:underline">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(1).map((post) => (
            <div
              key={post.slug}
              className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs hover:border-zinc-300 transition-all flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-zinc-900 shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-900 leading-snug group-hover:text-[#B00020] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B00020] group-hover:underline">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

