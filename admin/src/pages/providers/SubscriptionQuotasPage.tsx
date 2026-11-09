import React from 'react';
import { 
  CreditCard, 
  Building2, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { mockProviders } from '../../data/mockAdminData';

export const SubscriptionQuotasPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter OOH',
      price: '₹0 / mo',
      limit: 10,
      providersCount: 14,
      features: ['Up to 50 Resources', 'Basic PDF Quotations', 'Standard KYC Verification'],
    },
    {
      name: 'Professional Network',
      price: '₹14,999 / mo',
      limit: 150,
      providersCount: 26,
      features: ['Up to 150 Resources', 'Live WhatsApp Status Alerts', 'Automated Invoicing & GST Logs', 'Priority Verification'],
    },
    {
      name: 'Enterprise Conglomerate',
      price: '₹49,999 / mo',
      limit: 'Unlimited',
      providersCount: 8,
      features: ['Unlimited Resources', 'DOOH Hardware CMS API', 'Dedicated Account Manager', 'Custom Escrow Schedule'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Provider Subscription Quotas & Plans
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              COMMERCIAL TIERS
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor inventory slot quotas, active SaaS subscription plans, and billing usage across all media owners.
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-4 hover:border-zinc-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">
                {plan.name}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                {plan.providersCount} Providers
              </span>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-zinc-950 font-sans">{plan.price}</div>
              <p className="text-xs text-zinc-500 mt-0.5">Quota Limit: <strong>{plan.limit} assets</strong></p>
            </div>

            <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
              {plan.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 text-zinc-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active Provider Usage Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="font-bold text-zinc-950 text-base">Provider Asset Quota Utilization</h3>
          <span className="text-xs text-zinc-400 font-mono">Live consumption against assigned limits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 font-bold">Media Provider</th>
                <th className="py-2.5 font-bold">Location</th>
                <th className="py-2.5 font-bold">Subscribed Plan</th>
                <th className="py-2.5 font-bold">Slots Consumed</th>
                <th className="py-2.5 font-bold">Utilization Meter</th>
                <th className="py-2.5 font-bold text-right">Quota Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mockProviders.map((prov) => {
                const planLimit = prov.resourceCount > 100 ? 500 : 100;
                const percentage = Math.min(100, Math.round((prov.resourceCount / planLimit) * 100));

                return (
                  <tr key={prov.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5">
                      <span className="font-bold text-zinc-900 block">{prov.name}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">{prov.id}</span>
                    </td>
                    <td className="py-3.5 font-medium text-zinc-700">{prov.city}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono text-[11px] font-semibold">
                        {prov.resourceCount > 100 ? 'Enterprise Conglomerate' : 'Professional Network'}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">
                      <span className="font-bold text-zinc-900">{prov.resourceCount}</span>
                      <span className="text-zinc-400"> / {planLimit} sites</span>
                    </td>
                    <td className="py-3.5 w-48">
                      <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                        {percentage}% utilized
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        HEALTHY
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
