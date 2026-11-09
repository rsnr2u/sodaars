'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { MarketplaceResource } from '@/types/marketplace';

export interface CartItem {
  resource: MarketplaceResource;
  durationDays: 15 | 30 | 60 | 90;
  includePrinting: boolean; // Optional: Advertiser can self-print or opt-in
  flightStartDate?: string;
  customNotes?: string;
  addedAt: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (resource: MarketplaceResource, durationDays?: 15 | 30 | 60 | 90, includePrinting?: boolean) => void;
  addMultipleToCart: (resources: MarketplaceResource[]) => void;
  removeFromCart: (resourceId: string) => void;
  toggleCart: (resource: MarketplaceResource) => void;
  updateDuration: (resourceId: string, durationDays: 15 | 30 | 60 | 90) => void;
  updatePrinting: (resourceId: string, includePrinting: boolean) => void;
  bulkSetDuration: (durationDays: 15 | 30 | 60 | 90) => void;
  bulkSetPrinting: (includePrinting: boolean) => void;
  clearCart: () => void;
  isInCart: (resourceId: string) => boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  totalCount: number;
  totalSqFt: number;
  totalDailyReach: number;
  totalMonthlyRental: number;
  totalEffectiveRental: number;
  totalMountingCost: number; // MANDATORY - Charged by Provider
  totalPrintingCost: number; // OPTIONAL - Can be self-printed by advertiser
  totalGst: number;
  grandTotal: number;
  citiesCovered: string[];
  cityBreakdown: Record<string, number>;
  exportMediaPlanCSV: (campaignName?: string) => void;
  exportMediaCartCSV: (campaignName?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'sodaars_media_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore JSON parse error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('sodaars_cart_updated'));
    } catch {
      // ignore
    }
  }, [items, isLoaded]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setItems(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isInCart = (resourceId: string): boolean => {
    return items.some((item) => item.resource.id === resourceId);
  };

  const addToCart = (
    resource: MarketplaceResource,
    durationDays: 15 | 30 | 60 | 90 = 30,
    includePrinting: boolean = false
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.resource.id === resource.id);
      if (existing) {
        return prev.map((i) =>
          i.resource.id === resource.id ? { ...i, durationDays, includePrinting } : i
        );
      }
      return [
        ...prev,
        {
          resource,
          durationDays,
          includePrinting,
          addedAt: Date.now(),
        },
      ];
    });
  };

  const addMultipleToCart = (resources: MarketplaceResource[]) => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.resource.id));
      const newItems: CartItem[] = [];

      for (const res of resources) {
        if (!existingIds.has(res.id)) {
          existingIds.add(res.id);
          newItems.push({
            resource: res,
            durationDays: 30,
            includePrinting: false,
            addedAt: Date.now(),
          });
        }
      }

      return [...prev, ...newItems];
    });
  };

  const removeFromCart = (resourceId: string) => {
    setItems((prev) => prev.filter((i) => i.resource.id !== resourceId));
  };

  const toggleCart = (resource: MarketplaceResource) => {
    if (isInCart(resource.id)) {
      removeFromCart(resource.id);
    } else {
      addToCart(resource, 30, false);
    }
  };

  const updateDuration = (resourceId: string, durationDays: 15 | 30 | 60 | 90) => {
    setItems((prev) =>
      prev.map((i) => (i.resource.id === resourceId ? { ...i, durationDays } : i))
    );
  };

  const updatePrinting = (resourceId: string, includePrinting: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.resource.id === resourceId ? { ...i, includePrinting } : i))
    );
  };

  const bulkSetDuration = (durationDays: 15 | 30 | 60 | 90) => {
    setItems((prev) => prev.map((i) => ({ ...i, durationDays })));
  };

  const bulkSetPrinting = (includePrinting: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, includePrinting })));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const {
    totalCount,
    totalSqFt,
    totalDailyReach,
    totalMonthlyRental,
    totalEffectiveRental,
    totalMountingCost,
    totalPrintingCost,
    totalGst,
    grandTotal,
    citiesCovered,
    cityBreakdown,
  } = useMemo(() => {
    let count = items.length;
    let sqFt = 0;
    let reach = 0;
    let monthlyRental = 0;
    let effectiveRental = 0;
    let mountingCost = 0;
    let printingCost = 0;
    const citiesSet = new Set<string>();
    const breakdown: Record<string, number> = {};

    for (const item of items) {
      const res = item.resource;
      const area = res.totalSqFt || (res.widthFt * res.heightFt);
      sqFt += area;

      // Estimate numeric daily reach from string e.g. "3,20,000+ Vehicles / Day"
      const reachMatch = (res.trafficDwellDaily || '').replace(/[^0-9]/g, '');
      const parsedReach = parseInt(reachMatch, 10);
      reach += isNaN(parsedReach) ? 100000 : parsedReach;

      // Pricing logic based on duration
      monthlyRental += res.marketplacePrice;
      const durationFactor = item.durationDays / 30;
      const itemRental = res.marketplacePrice * durationFactor;
      effectiveRental += itemRental;

      // MANDATORY Mounting & Rigging by Provider (Always charged)
      const itemMounting = (res.mountingRatePerSqFt || 6) * area;
      mountingCost += itemMounting;

      // OPTIONAL Flex Printing (Advertiser can print their own or opt-in)
      if (item.includePrinting) {
        const itemPrinting = (res.printingRatePerSqFt || 14) * area;
        printingCost += itemPrinting;
      }

      if (res.location?.city) {
        citiesSet.add(res.location.city);
        breakdown[res.location.city] = (breakdown[res.location.city] || 0) + 1;
      }
    }

    const subtotal = effectiveRental + mountingCost + printingCost;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    return {
      totalCount: count,
      totalSqFt: sqFt,
      totalDailyReach: reach,
      totalMonthlyRental: monthlyRental,
      totalEffectiveRental: Math.round(effectiveRental),
      totalMountingCost: Math.round(mountingCost),
      totalPrintingCost: Math.round(printingCost),
      totalGst: gst,
      grandTotal: total,
      citiesCovered: Array.from(citiesSet),
      cityBreakdown: breakdown,
    };
  }, [items]);

  // Export Media Cart as CSV
  const exportMediaCartCSV = (campaignName: string = 'OOH-Media-Cart') => {
    if (items.length === 0) return;

    const headers = [
      'Asset ID',
      'Hoarding Name',
      'Media Type',
      'City',
      'Corridor / Area',
      'Landmark',
      'Width (ft)',
      'Height (ft)',
      'Total Area (sq.ft)',
      'Facing',
      'Illumination',
      'Daily Traffic',
      'Flight Duration (Days)',
      'Monthly Rate (INR)',
      'Effective Space Rental (INR)',
      'Mandatory Mounting by Provider (INR)',
      'Flex Printing by Provider (INR)',
      'Printing Option Selected',
      'Item Subtotal (INR)',
      'Verified Partner',
    ];

    const rows = items.map((item) => {
      const res = item.resource;
      const area = res.totalSqFt || (res.widthFt * res.heightFt);
      const durationFactor = item.durationDays / 30;
      const itemRental = Math.round(res.marketplacePrice * durationFactor);
      const itemMounting = Math.round((res.mountingRatePerSqFt || 6) * area);
      const itemPrinting = item.includePrinting
        ? Math.round((res.printingRatePerSqFt || 14) * area)
        : 0;
      const itemSubtotal = itemRental + itemMounting + itemPrinting;

      return [
        `"${res.id}"`,
        `"${res.name.replace(/"/g, '""')}"`,
        `"${res.type}"`,
        `"${res.location.city}"`,
        `"${res.location.area.replace(/"/g, '""')}"`,
        `"${(res.location.landmark || '').replace(/"/g, '""')}"`,
        res.widthFt,
        res.heightFt,
        res.totalSqFt,
        `"${res.orientation || ''}"`,
        `"${res.illumination}"`,
        `"${res.trafficDwellDaily}"`,
        item.durationDays,
        res.marketplacePrice,
        itemRental,
        itemMounting,
        itemPrinting,
        item.includePrinting ? 'Printed by Media Partner' : 'Self-Printed by Advertiser/Agency',
        itemSubtotal,
        `"${res.providerDisplayBadge || 'Verified Partner'}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${campaignName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        toggleCart,
        updateDuration,
        updatePrinting,
        bulkSetDuration,
        bulkSetPrinting,
        clearCart,
        isInCart,
        isDrawerOpen,
        setIsDrawerOpen,
        totalCount,
        totalSqFt,
        totalDailyReach,
        totalMonthlyRental,
        totalEffectiveRental,
        totalMountingCost,
        totalPrintingCost,
        totalGst,
        grandTotal,
        citiesCovered,
        cityBreakdown,
        exportMediaPlanCSV: exportMediaCartCSV,
        exportMediaCartCSV,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
