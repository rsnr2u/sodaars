'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Calendar,
  Sparkles,
  Download,
  PlusCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrencyINR } from '@/lib/utils';
import { generateSampleHoardings } from '@/lib/bulkHoardingGenerator';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    clearCart,
    updateDuration,
    updatePrinting,
    totalCount,
    totalEffectiveRental,
    totalMountingCost,
    totalPrintingCost,
    totalGst,
    grandTotal,
    totalDailyReach,
    totalSqFt,
    citiesCovered,
    addMultipleToCart,
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleAdd50Demo = () => {
    const demoItems = generateSampleHoardings(50);
    addMultipleToCart(demoItems);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-zinc-200 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#B00020] flex items-center justify-center font-semibold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-zinc-900">
                    Media Cart
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#B00020] text-white">
                    {totalCount}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-normal">
                  {citiesCovered.length > 0 ? `${citiesCovered.length} Metros Covered` : 'Your selected billboard inventory'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-xl hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar (Useful for agency planners) */}
          {items.length > 0 && (
            <div className="px-4 py-2.5 bg-zinc-100/70 border-b border-zinc-200/70 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Reach</span>
                <span className="text-xs font-semibold text-zinc-900 block truncate">
                  ~{(totalDailyReach / 100000).toFixed(1)}L daily
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Area</span>
                <span className="text-xs font-semibold text-zinc-900 block truncate">
                  {totalSqFt.toLocaleString('en-IN')} sq.ft
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Cities</span>
                <span className="text-xs font-semibold text-[#B00020] block truncate">
                  {citiesCovered.length} Hubs
                </span>
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#B00020] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-zinc-900">Your Media Cart is Empty</h3>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Browse verified hoardings across Mumbai, Bengaluru, Delhi NCR, and add them to your media cart.
                  </p>
                </div>

                <div className="pt-2 space-y-2 w-full max-w-xs">
                  <Link
                    href="/explore"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Browse All Hoardings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleAdd50Demo}
                    className="w-full py-2.5 px-4 rounded-full border border-dashed border-[#B00020] bg-rose-50/50 hover:bg-rose-50 text-[#B00020] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Load 50 Sample Metro Hoardings</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Agency Quick Utilities Bar */}
                <div className="flex items-center justify-between pb-1 text-xs">
                  <span className="text-zinc-500 text-[11px] font-medium">
                    Showing {items.length} hoarding{items.length > 1 ? 's' : ''} in cart
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAdd50Demo}
                      className="text-[11px] font-semibold text-[#B00020] hover:underline cursor-pointer"
                    >
                      + Add 50 Sample
                    </button>
                    <span className="text-zinc-300">|</span>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {items.map((item, idx) => {
                  const res = item.resource;
                  const durationFactor = item.durationDays / 30;
                  const itemRental = Math.round(res.marketplacePrice * durationFactor);
                  const itemMounting = Math.round((res.mountingRatePerSqFt || 6) * res.totalSqFt);
                  const itemPrinting = item.includePrinting
                    ? Math.round((res.printingRatePerSqFt || 14) * res.totalSqFt)
                    : 0;
                  const itemTotal = itemRental + itemMounting + itemPrinting;

                  return (
                    <div
                      key={`${res.id}-${idx}`}
                      className="bg-white rounded-2xl border border-zinc-200/80 p-3 sm:p-3.5 shadow-2xs space-y-2.5 hover:border-zinc-300 transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 relative">
                          <img
                            src={res.primaryPhotoUrl}
                            alt={res.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] uppercase font-semibold text-[#B00020] tracking-wider truncate">
                              {res.location.city} • {res.type}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(res.id)}
                              className="text-zinc-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                              title="Remove from cart"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h4 className="text-xs font-semibold text-zinc-900 leading-snug line-clamp-1">
                            {res.name}
                          </h4>

                          <p className="text-[11px] text-zinc-500 truncate">
                            {res.widthFt} × {res.heightFt} ft • {res.totalSqFt} sq.ft • {res.illumination}
                          </p>
                        </div>
                      </div>

                      {/* Flight Duration Selector & Printing Checkbox */}
                      <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {/* Duration Pills */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-zinc-400 font-medium mr-1">Flight:</span>
                            {([15, 30, 60] as const).map((days) => (
                              <button
                                key={days}
                                type="button"
                                onClick={() => updateDuration(res.id, days)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                                  item.durationDays === days
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                                }`}
                              >
                                {days}d
                              </button>
                            ))}
                          </div>

                          {/* Mandatory Mounting Pill */}
                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            Mounting: {formatCurrencyINR(itemMounting)} (Mandatory)
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          {/* Flex Printing Toggle */}
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.includePrinting}
                              onChange={(e) => updatePrinting(res.id, e.target.checked)}
                              className="w-3.5 h-3.5 text-[#B00020] rounded border-zinc-300 focus:ring-[#B00020] cursor-pointer"
                            />
                            <span className="text-[11px] text-zinc-600 font-medium">
                              {item.includePrinting ? `Flex Print (+${formatCurrencyINR(itemPrinting)})` : 'Self-Supply Flex (₹0)'}
                            </span>
                          </label>

                          {/* Subtotal */}
                          <span className="font-semibold text-xs text-[#B00020]">
                            {formatCurrencyINR(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer Billing & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200/90 bg-zinc-50/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Display Space Rental ({items.length} hoardings):</span>
                  <span className="font-medium text-zinc-900">{formatCurrencyINR(totalEffectiveRental)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    Mounting & Rigging:
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">Mandatory Provider</span>
                  </span>
                  <span className="font-medium text-zinc-900">{formatCurrencyINR(totalMountingCost)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Flex Printing (Optional):</span>
                  <span className={`font-medium ${totalPrintingCost > 0 ? 'text-zinc-900' : 'text-zinc-400 italic'}`}>
                    {totalPrintingCost > 0 ? formatCurrencyINR(totalPrintingCost) : 'Self-Supplied by Client (₹0)'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated GST (18%):</span>
                  <span className="font-medium text-zinc-900">{formatCurrencyINR(totalGst)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-zinc-200/70">
                  <span>Campaign Grand Total:</span>
                  <span className="text-[#B00020] text-base font-semibold">{formatCurrencyINR(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3 px-4 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
                >
                  <span>View Full Media Cart & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Escrow Protected • Instant Reservation</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

