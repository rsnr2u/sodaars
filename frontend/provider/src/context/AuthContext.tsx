import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, OrganizationSummary, Membership, ProviderRole } from '../types/auth';
import type { LoginPayload, RegisterPayload } from '../services/authService';
import authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

interface AuthContextType {
  user: User | null;
  activeOrg: OrganizationSummary | null;
  role: ProviderRole | null;
  memberships: Membership[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchOrganization: (orgUuidOrId: string | number) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeOrg, setActiveOrg] = useState<OrganizationSummary | null>(null);
  const [role, setRole] = useState<ProviderRole | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('sodaars_provider_token');
    localStorage.removeItem('sodaars_active_org_id');
    setUser(null);
    setActiveOrg(null);
    setRole(null);
    setMemberships([]);
  }, []);

  // Fetch initial session on application mount
  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem('sodaars_provider_token');
    if (!token) {
      clearSession();
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.me();
      setUser(data.user);
      setMemberships(data.memberships || []);

      // Determine active organization context
      const savedOrgId = localStorage.getItem('sodaars_active_org_id');
      let targetMembership: Membership | undefined;

      if (savedOrgId && data.memberships?.length) {
        targetMembership = data.memberships.find(
          (m) => String(m.organization.id) === String(savedOrgId) || m.organization.uuid === savedOrgId
        );
      }

      if (!targetMembership && data.memberships?.length) {
        targetMembership = data.memberships.find((m) => m.is_default) || data.memberships[0];
      }

      if (targetMembership) {
        setActiveOrg(targetMembership.organization);
        setRole(targetMembership.role);
        localStorage.setItem('sodaars_active_org_id', targetMembership.organization.uuid);
      } else if (data.current_organization) {
        setActiveOrg(data.current_organization);
        setRole(data.provider_role);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    // Register 401 interceptor callback
    setUnauthorizedHandler(() => {
      clearSession();
    });

    refreshSession();
  }, [refreshSession, clearSession]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const data = await authService.login(payload);
      localStorage.setItem('sodaars_provider_token', data.token);

      setUser(data.user);
      const loadedMemberships = data.memberships || [];
      setMemberships(loadedMemberships);

      // Determine initial active organization
      let chosenOrg: OrganizationSummary | null = null;
      let chosenRole: ProviderRole | null = null;

      if (data.organization) {
        chosenOrg = data.organization;
        chosenRole = data.provider_role || 'PROVIDER_OWNER';
      } else if (loadedMemberships.length > 0) {
        const defaultMem = loadedMemberships.find((m) => m.is_default) || loadedMemberships[0];
        chosenOrg = defaultMem.organization;
        chosenRole = defaultMem.role;
      }

      if (chosenOrg) {
        setActiveOrg(chosenOrg);
        setRole(chosenRole);
        localStorage.setItem('sodaars_active_org_id', chosenOrg.uuid);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const data = await authService.register(payload);
      localStorage.setItem('sodaars_provider_token', data.token);

      setUser(data.user);
      const loadedMemberships = data.memberships || [];
      setMemberships(loadedMemberships);

      if (data.organization) {
        setActiveOrg(data.organization);
        setRole(data.provider_role || 'PROVIDER_OWNER');
        localStorage.setItem('sodaars_active_org_id', data.organization.uuid);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Proceed even if backend logout fails
    } finally {
      clearSession();
      setIsLoading(false);
    }
  };

  /**
   * Switch active organization locally from in-memory memberships array.
   * Eliminates unnecessary round-trip to /auth/me (Adjustment 2).
   */
  const switchOrganization = (orgUuidOrId: string | number) => {
    const target = memberships.find(
      (m) => String(m.organization.id) === String(orgUuidOrId) || m.organization.uuid === String(orgUuidOrId)
    );

    if (target) {
      setActiveOrg(target.organization);
      setRole(target.role);
      localStorage.setItem('sodaars_active_org_id', target.organization.uuid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeOrg,
        role,
        memberships,
        isAuthenticated: !!user && !!localStorage.getItem('sodaars_provider_token'),
        isLoading,
        login,
        register,
        logout,
        switchOrganization,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
