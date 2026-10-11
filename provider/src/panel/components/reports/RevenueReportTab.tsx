import React from 'react';
import {
  TrendingUp,
  Award,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { RevenueMonthlyRecord, TopRevenueLocationRecord } from '../../types/report';

export interface RevenueReportTabProps {
  monthlyTrends: RevenueMonthlyRecord[];
  topLocations: TopRevenueLocationRecord[];
}

export const RevenueReportTab: React.FC<RevenueReportTabProps> = ({
  monthlyTrends,
  topLocations,
}) => {
  const currentMonth = monthlyTrends[monthlyTrends.length - 1] || {
    totalRevenue: 2485000,
    directRevenue: 1610000,
    adminRevenue: 535000,
    marketplaceRevenue: 340000,
    bookingCount: 15,
    avgRatePerSqFt: 248,
  };

  const prevMonth = monthlyTrends[monthlyTrends.length - 2];
  const momGrowth =
    prevMonth && prevMonth.totalRevenue > 0
      ? (((currentMonth.totalRevenue - prevMonth.totalRevenue) / prevMonth.totalRevenue) * 100).toFixed(1)
      : '4.4';

  const maxMonthlyRevenue = Math.max(...monthlyTrends.map((m) => m.totalRevenue), 1);

  return (
    <div className="space-y-6">
      {/* 1. REVENUE KPI SUMMARY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* TOTAL INVOICED REVENUE */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Active Invoiced GMV
            </span>
            <span className="text-xs font-bold text-[#EA580C]">₹ (INR)</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              ₹{(currentMonth.totalRevenue / 100000).toFixed(2)}L
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              +{momGrowth}% MoM
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            ₹{currentMonth.totalRevenue.toLocaleString('en-IN')} total realized
          </span>
        </div>

        {/* AVERAGE RATE PER SQ.FT */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Portfolio Sq.Ft Yield
            </span>
            <TrendingUp size={15} className="text-emerald-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              ₹{currentMonth.avgRatePerSqFt}
            </span>
            <span className="text-xs text-[#737373]">/ sq.ft / mo</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Average realization per unit area
          </span>
        </div>

        {/* AVERAGE DEAL SIZE */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Average Booking Size
            </span>
            <Award size={15} className="text-blue-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              ₹{Math.round(currentMonth.totalRevenue / currentMonth.bookingCount / 1000)}k
            </span>
            <span className="text-xs text-[#737373]">/ booking</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            {currentMonth.bookingCount} confirmed client bookings
          </span>
        </div>

        {/* DIRECT BILLING REALIZATION */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Direct Provider Share
            </span>
            <Layers size={15} className="text-[#EA580C]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#EA580C] leading-none">
              {((currentMonth.directRevenue / currentMonth.totalRevenue) * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-stone-500">₹{(currentMonth.directRevenue / 100000).toFixed(1)}L</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            High margin direct client billing
          </span>
        </div>
      </div>

      {/* 2. MONTHLY REVENUE GROWTH VISUALIZATION */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Month-over-Month Revenue Realization Trend (Last 6 Months)
            </h3>
            <p className="text-[11px] text-[#737373] mt-0.5">
              Gross billing progression across Provider Direct, Admin Placed, and Marketplace channels.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EA580C]" />
              <span className="text-stone-700">Provider Direct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
              <span className="text-stone-700">Admin Placed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              <span className="text-stone-700">Marketplace</span>
            </div>
          </div>
        </div>

        {/* Stacked Interactive Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-52">
            {monthlyTrends.map((trend) => {
              const totalHeightPct = (trend.totalRevenue / maxMonthlyRevenue) * 100;
              const directPct = (trend.directRevenue / trend.totalRevenue) * 100;
              const adminPct = (trend.adminRevenue / trend.totalRevenue) * 100;
              const marketPct = (trend.marketplaceRevenue / trend.totalRevenue) * 100;

              return (
                <div key={trend.month} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-bold text-[#171717] mb-1.5 group-hover:scale-110 transition-transform">
                    ₹{(trend.totalRevenue / 100000).toFixed(1)}L
                  </div>

                  {/* Multi-stack bar */}
                  <div
                    className="w-full max-w-[42px] bg-stone-100 rounded-t-lg overflow-hidden flex flex-col-reverse shadow-2xs group-hover:ring-2 group-hover:ring-[#EA580C]/30 transition-all cursor-pointer"
                    style={{ height: `${totalHeightPct}%` }}
                  >
                    <div
                      style={{ height: `${directPct}%` }}
                      className="bg-[#EA580C] w-full"
                      title={`Provider Direct: ₹${trend.directRevenue.toLocaleString('en-IN')}`}
                    />
                    <div
                      style={{ height: `${adminPct}%` }}
                      className="bg-[#3B82F6] w-full"
                      title={`Admin Placed: ₹${trend.adminRevenue.toLocaleString('en-IN')}`}
                    />
                    <div
                      style={{ height: `${marketPct}%` }}
                      className="bg-[#10B981] w-full"
                      title={`Marketplace: ₹${trend.marketplaceRevenue.toLocaleString('en-IN')}`}
                    />
                  </div>

                  <span className="text-[10px] font-medium text-[#737373] mt-2 truncate max-w-full text-center">
                    {trend.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. TOP REVENUE GENERATING PRIME LOCATIONS */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#EA580C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Top Revenue Generating Prime Assets
            </h3>
          </div>
          <span className="text-[11px] text-[#737373]">
            Ranking by total realized billing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <th className="py-2.5 px-3">Rank & Asset</th>
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Occupancy %</th>
                <th className="py-2.5 px-3">Active Clients</th>
                <th className="py-2.5 px-3 text-right">Realized Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {topLocations.map((loc, idx) => (
                <tr key={loc.locationId} className="hover:bg-[#FAFAF9]">
                  <td className="py-2.5 px-3 font-semibold text-[#171717]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-700 shrink-0">
                        #{idx + 1}
                      </span>
                      <span>{loc.resourceName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#525252]">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className="text-[#EA580C]" />
                      <span>{loc.city}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200">
                      {loc.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">
                    {loc.occupancyPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-[#525252]">
                    {loc.clientCount} clients
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-[#EA580C]">
                    ₹{loc.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MONTHLY HISTORICAL REVENUE TABLE */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="bg-[#FAFAF9] px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#737373]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Historical Invoicing & Realization Ledger
            </h3>
          </div>
          <span className="text-[11px] text-[#737373]">
            Amounts in INR inclusive of all booked flightings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4">Provider Direct</th>
                <th className="py-3 px-4">Admin Placed</th>
                <th className="py-3 px-4">Marketplace</th>
                <th className="py-3 px-4">Yield / Sq.Ft</th>
                <th className="py-3 px-4 text-right">Total Realized GMV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {monthlyTrends.slice().reverse().map((m) => (
                <tr key={m.month} className="hover:bg-[#FAFAF9]">
                  <td className="py-3 px-4 font-bold text-[#171717]">{m.month}</td>
                  <td className="py-3 px-4 font-medium text-[#525252]">{m.bookingCount} deals</td>
                  <td className="py-3 px-4 text-[#EA580C] font-semibold">
                    ₹{m.directRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#3B82F6] font-semibold">
                    ₹{m.adminRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#10B981] font-semibold">
                    ₹{m.marketplaceRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#171717]">
                    ₹{m.avgRatePerSqFt}/sq.ft
                  </td>
                  <td className="py-3 px-4 text-right font-black text-sm text-[#171717]">
                    ₹{m.totalRevenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportTab;
