import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminTopbar } from './AdminTopbar';
import { AdminSidebar } from './AdminSidebar';
import { DomainType } from '../../types';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Deduce domain from location path
  const getDomainFromPath = (path: string): DomainType => {
    if (path.startsWith('/admin/providers') || path.startsWith('/admin/resources') || path.startsWith('/admin/subscriptions')) {
      return 'provider';
    }
    if (path.startsWith('/admin/marketplace')) {
      return 'marketplace';
    }
    return 'administration';
  };

  const [currentDomain, setCurrentDomain] = useState<DomainType>(() => getDomainFromPath(location.pathname));

  // Sync domain when path changes
  useEffect(() => {
    setCurrentDomain(getDomainFromPath(location.pathname));
  }, [location.pathname]);

  const handleDomainChange = (domain: DomainType) => {
    setCurrentDomain(domain);
    if (domain === 'administration') {
      navigate('/admin/dashboard');
    } else if (domain === 'provider') {
      navigate('/admin/providers');
    } else if (domain === 'marketplace') {
      navigate('/admin/marketplace');
    }
  };

  // Provider Operations pages (both directory /admin/providers and detail /admin/providers/:id) do not need the outer global sidebar!
  const isProviderDomain = currentDomain === 'provider' || location.pathname.startsWith('/admin/providers');

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans">
      <AdminTopbar currentDomain={currentDomain} onDomainChange={handleDomainChange} />
      
      {/* Position Fixed Sidebar only for non-provider domains */}
      {!isProviderDomain && <AdminSidebar currentDomain={currentDomain} />}
      
      {/* Main Content Area:
          - If isProviderDomain: full width (no md:ml-64 margin!)
          - If other domains: md:ml-64 clears the 256px fixed sidebar
      */}
      <main className={`pt-24 pb-12 bg-[#fafaf9] min-h-screen ${isProviderDomain ? 'w-full px-4 sm:px-6 lg:px-8' : 'md:ml-64 px-6 lg:px-8'}`}>
        <div className="max-w-[1700px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
