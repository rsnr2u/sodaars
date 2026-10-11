import React from 'react';
import { Outlet } from 'react-router-dom';
import OrganizationSideMenu from '../components/organization/OrganizationSideMenu';

export const OrganizationLayout: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F4] min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side Sub Menu in Content Area */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-20 z-10">
          <OrganizationSideMenu />
        </aside>

        {/* Right Content Area for Active Organization Sub-Page */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizationLayout;
