'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import type { PublicProvider } from '@/lib/api';
import ContactModal from '@/components/ContactModal';

interface ProviderClientWrapperProps {
  provider: PublicProvider;
}

export default function ProviderClientWrapper({ provider }: ProviderClientWrapperProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="shrink-0 flex items-center gap-3">
      <button
        onClick={() => setIsContactOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition active:scale-95"
      >
        <Send className="h-4 w-4" />
        <span>Contact Provider Directly</span>
      </button>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        targetType="provider"
        targetSlug={provider.slug}
        targetTitle={`General Inquiry for ${provider.name}`}
        providerName={provider.name}
      />
    </div>
  );
}
