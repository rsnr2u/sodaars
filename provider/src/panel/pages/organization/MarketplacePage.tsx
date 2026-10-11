import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { ShoppingBag, FileSignature, AlertCircle } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header & Primary Actions Card */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
            Organization Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Marketplace Settings & Inventory Participation
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Control voluntary Marketplace participation, enable/disable listings, and configure SODAARS Net Prices.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/panel/organization/marketplace-agreement">
            <Button variant="secondary" size="sm" leftIcon={<FileSignature size={14} />}>
              View Agreement
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-orange-50/60 border border-orange-200 flex items-start gap-3 shadow-xs">
        <AlertCircle size={18} className="text-[#EA580C] shrink-0 mt-0.5" />
        <div className="text-xs text-[#525252] leading-relaxed">
          <strong className="text-[#171717]">Provider Independence:</strong> Marketplace distribution is voluntary. Enabling Marketplace on an asset exposes it to advertiser discovery at your designated net price. Direct client bookings outside the Marketplace are never affected.
        </div>
      </div>

      <Card className="border-dashed border-2 border-stone-300 bg-white/60">
        <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center mb-4">
            <ShoppingBag size={24} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-base font-bold text-[#171717]">Marketplace Management Foundation</h2>
            <Badge variant="brand">Route: /panel/organization/marketplace</Badge>
          </div>
          <p className="text-xs text-[#525252] leading-relaxed">
            Screen 2.8.4 foundation established. Ready for master Marketplace participation toggle, agreement status badge, and resource-level participation table.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MarketplacePage;
