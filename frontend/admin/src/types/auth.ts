export type PlatformRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export interface User {
  id: number;
  uuid?: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  platform_role: PlatformRole | string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
  device_name?: string;
}

export interface AdminAuthData {
  token: string;
  token_type: string;
  user: User;
  platform_role: PlatformRole;
}

export interface AuthMeData {
  user: User;
  platform_role: PlatformRole;
  is_platform_user: boolean;
  status: string;
  email_verified: boolean;
}
