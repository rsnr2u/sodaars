import React from 'react';
import { Outlet } from 'react-router-dom';
import PanelTopbar from '../components/PanelTopbar';

export const ProviderPanelLayout: React.FC = () => {
  return (
    <div className="provider-panel min-h-screen flex flex-col bg-[#FBF9F8] text-[#171717]">
      {/* 1. Fixed Topbar Navigation Only — STRICTLY NO SIDEBAR */}
      <PanelTopbar />

      {/* 2. Main Operational Content Canvas */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      {/* 3. Operational Panel Footer */}
      <footer className="w-full bg-[#F5F3F2] border-t border-[#E5E5E5] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
          <span>© 2026 SODAARS. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>SODAARS Provider Platform</span>
            <span>•</span>
            <span>Provider Operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProviderPanelLayout;
