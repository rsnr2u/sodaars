import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../public/components/PublicNavbar';
import PublicFooter from '../public/components/PublicFooter';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#171717]">
      <PublicNavbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
