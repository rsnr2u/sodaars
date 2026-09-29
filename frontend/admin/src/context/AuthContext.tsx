import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, PlatformRole, AdminLoginCredentials } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  platformRole: PlatformRole | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isPlatformAdmin: boolean;
  isStaff: boolean;
  login: (credentials: AdminLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [platformRole, setPlatformRole] = useState<PlatformRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setPlatformRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.me();
      if (data && data.is_platform_user) {
        setUser(data.user);
        setPlatformRole(data.platform_role);
      } else {
        // Not a platform user, clear token
        await authService.logout();
        setUser(null);
        setPlatformRole(null);
      }
    } catch {
      setUser(null);
      setPlatformRole(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: AdminLoginCredentials) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      setUser(authData.user);
      setPlatformRole(authData.platform_role);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setPlatformRole(null);
      setIsLoading(false);
    }
  };

  const isSuperAdmin = platformRole === 'SUPER_ADMIN';
  const isPlatformAdmin = platformRole === 'SUPER_ADMIN' || platformRole === 'ADMIN';
  const isStaff = platformRole === 'SUPER_ADMIN' || platformRole === 'ADMIN' || platformRole === 'STAFF';

  return (
    <AuthContext.Provider
      value={{
        user,
        platformRole,
        isLoading,
        isSuperAdmin,
        isPlatformAdmin,
        isStaff,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
