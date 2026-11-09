import React from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  Wifi, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  const services = [
    { name: 'Core API Gateway', latency: '24ms', uptime: '99.99%', status: 'OPERATIONAL' },
    { name: 'MySQL Primary Cluster', latency: '4ms', uptime: '100.0%', status: 'OPERATIONAL' },
    { name: 'Redis Cache & Session Broker', latency: '1ms', uptime: '100.0%', status: 'OPERATIONAL' },
    { name: 'Media Asset S3 & CDN Store', latency: '48ms', uptime: '99.98%', status: 'OPERATIONAL' },
    { name: 'GSTIN Validation API (Gov Portal)', latency: '320ms', uptime: '98.50%', status: 'DEGRADED_LATENCY' },
    { name: 'Automated EXIF Geotag Verification Worker', latency: '110ms', uptime: '100.0%', status: 'OPERATIONAL' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              System Health
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              99.98% OPERATIONAL
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time latency metrics, database cluster status, and external service bridges.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs transition-colors self-start sm:self-auto font-mono">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Poll Now</span>
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="font-bold text-zinc-900 text-sm">Infrastructure Microservices Status</h3>
          <span className="text-xs text-zinc-400 font-mono">Region: ap-south-1 (Mumbai)</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {services.map((srv, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${srv.status === 'OPERATIONAL' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div>
                  <span className="font-semibold text-zinc-900 text-xs block">{srv.name}</span>
                  <span className="text-[11px] text-zinc-500 font-mono">Latency: {srv.latency}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-zinc-500">Uptime: <strong className="text-zinc-800">{srv.uptime}</strong></span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    srv.status === 'OPERATIONAL'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {srv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
