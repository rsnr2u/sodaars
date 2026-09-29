import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { PlatformRole } from '../types/auth';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: PlatformRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, platformRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fullscreen-loading">
        <div className="spinner-large" />
        <p className="loading-text">Verifying platform authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && platformRole && !allowedRoles.includes(platformRole)) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <ShieldAlert size={48} />
          </div>
          <h2>Access Restricted</h2>
          <p>
            Your current platform role <strong>({platformRole})</strong> does not have permission
            to view this administrative section.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
