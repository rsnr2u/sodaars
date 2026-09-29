import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  locations: 'Locations',
  resources: 'Advertising Resources',
  availability: 'Availability & Schedules',
  leads: 'Directory Leads',
  settings: 'Organization Settings',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return (
      <div className="breadcrumbs">
        <span className="current">Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
        <Home size={15} />
      </Link>
      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const name = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={url}>
            <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} />
            {isLast ? (
              <span className="current">{name}</span>
            ) : (
              <Link to={url}>{name}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
