'use client';

import { useState } from 'react';
import { Send, Image as ImageIcon, Camera, Share2, Check } from 'lucide-react';
import type { PublicResourceDetail } from '@/lib/api';
import ContactModal from '@/components/ContactModal';

interface DetailClientWrapperProps {
  resource: PublicResourceDetail;
}

export default function DetailClientWrapper({ resource }: DetailClientWrapperProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const mediaList = resource.media && resource.media.length > 0
    ? resource.media
    : resource.primary_media
    ? [resource.primary_media]
    : [];

  const activeMedia = mediaList[selectedMediaIndex] || null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Photo Display Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-md">
        <div className="relative aspect-[16/10] w-full bg-slate-900 flex items-center justify-center">
          {activeMedia ? (
            <img
              src={activeMedia.display_url || activeMedia.thumbnail_url}
              alt={activeMedia.alt_text || resource.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="text-center text-slate-500 py-16">
              <Camera className="h-12 w-12 mx-auto mb-2 text-slate-600" />
              <p className="text-xs font-medium">No verified site photos uploaded yet</p>
            </div>
          )}

          {/* Share & Caption Overlay */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="rounded-full bg-slate-900/80 p-2.5 text-white backdrop-blur-md hover:bg-slate-900 transition shadow-sm"
              title="Copy share link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>

          {activeMedia?.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 text-xs text-white">
              <span className="font-medium">{activeMedia.caption}</span>
            </div>
          )}
        </div>

        {/* Thumbnail Reel (if multiple media assets exist) */}
        {mediaList.length > 1 && (
          <div className="flex items-center gap-2.5 p-3 overflow-x-auto bg-slate-950 border-t border-slate-800">
            {mediaList.map((m, idx) => {
              const isCurrent = idx === selectedMediaIndex;
              return (
                <button
                  key={m.uuid || idx}
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    isCurrent ? 'border-indigo-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={m.thumbnail_url || m.display_url}
                    alt={m.alt_text || `Photo ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Prominent Contact Action Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 p-6 text-white shadow-xl shadow-indigo-600/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight">
            Interested in this advertising face?
          </h3>
          <p className="text-xs text-indigo-100 mt-0.5">
            Submit your requirements directly to <strong className="text-white">{resource.provider.name}</strong>. No broker fees or intermediaries.
          </p>
        </div>

        <button
          onClick={() => setIsContactOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-black text-indigo-700 shadow-md hover:bg-indigo-50 transition active:scale-95 shrink-0"
        >
          <Send className="h-4 w-4" />
          <span>Contact Provider Directly</span>
        </button>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        targetType="resource"
        targetSlug={resource.slug}
        targetTitle={`${resource.name} (${resource.code})`}
        providerName={resource.provider.name}
      />
    </div>
  );
}
