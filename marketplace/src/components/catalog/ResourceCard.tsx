'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  MapPin,
  ShoppingBag,
  Check
} from 'lucide-react';
import { MarketplaceResource } from '@/types/marketplace';
import { formatCurrencyINR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ResourceCardProps {
  resource: MarketplaceResource;
  onQuickBook?: (resource: MarketplaceResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onQuickBook }) => {
  const { isInCart, toggleCart } = useCart();
  const inCart = isInCart(resource.id);

  const [isSaved, setIsSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState(resource.primaryPhotoUrl);

  useEffect(() => {
    setImgSrc(resource.primaryPhotoUrl);
  }, [resource.primaryPhotoUrl]);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Media Image */}
      <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={`${resource.name} - ${resource.location.city} Billboard`}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10">
          {/* Format Type Pill */}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-zinc-800 shadow-xs backdrop-blur-xs">
            {resource.type}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Quick Cart Pill Indicator if in cart */}
            {inCart && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                <Check className="w-3 h-3" />
                <span>In Cart</span>
              </span>
            )}

            {/* Heart / Save Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              className="w-7 h-7 rounded-full bg-white/95 hover:bg-white text-zinc-600 hover:text-[#B00020] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              title="Save to shortlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-[#B00020] fill-[#B00020]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Location pill over photo */}
        <div className="absolute bottom-2 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-300" />
            <span className="truncate max-w-[180px]">{resource.location.area}</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Verified Partner Badge */}
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-full font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Partner</span>
            </span>
            <span className="text-xs text-zinc-500 font-medium">{resource.location.city}</span>
          </div>

          {/* Title */}
          <Link href={`/resources/${resource.slug}`} className="block group-hover:text-[#B00020] transition-colors">
            <h3 className="font-semibold text-zinc-900 text-sm leading-snug line-clamp-1">
              {resource.name}
            </h3>
          </Link>

          {/* Specs Line: Dimensions • SqFt • Facing */}
          <p className="text-xs text-zinc-500 font-normal truncate">
            {resource.widthFt} × {resource.heightFt} ft • {resource.totalSqFt} sq.ft • {resource.orientation || resource.illumination}
          </p>
        </div>

        {/* Pricing & CTA Actions (2-Tier Clean Layout - Zero Overlap at any width) */}
        <div className="pt-3 border-t border-zinc-100/90 space-y-2.5">
          {/* Price Block - Full Width */}
          <div>
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">
              From
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base sm:text-[17px] font-semibold text-[#B00020] tracking-tight">
                {formatCurrencyINR(resource.marketplacePrice)}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                / month
              </span>
            </div>
          </div>

          {/* Action Buttons: Clean 50/50 Grid */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            {/* Quick Add / Remove from Media Cart */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCart(resource);
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                inCart
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
              }`}
              title={inCart ? 'Click to remove from media cart' : 'Add to media cart'}
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">In Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span className="truncate">+ Cart</span>
                </>
              )}
            </button>

            {/* View Details Link */}
            <Link
              href={`/resources/${resource.slug}`}
              className="py-2 px-2.5 rounded-xl bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs transition-all flex items-center justify-center gap-1 shadow-2xs font-sans cursor-pointer active:scale-95 text-center"
            >
              <span className="hidden 2xl:inline">View Details</span>
              <span className="2xl:hidden">View</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
