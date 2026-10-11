export type TeamRole = 'Owner' | 'Manager' | 'Viewer';
export type TeamMemberStatus = 'Active' | 'Invited' | 'Suspended';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamMemberStatus;
  joinedDate: string;
  lastActive: string;
  avatarInitials: string;
  phone?: string;
  isCurrentUser?: boolean;
}

export interface TeamInvitation {
  id: string;
  email: string;
  name?: string;
  role: 'Manager' | 'Viewer';
  sentDate: string;
  expiresDate: string;
  invitedBy: string;
}

export const CANONICAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user_001',
    name: 'Rajesh Kumar',
    email: 'rajesh@apexoutdoor.com',
    role: 'Owner',
    status: 'Active',
    joinedDate: '2023-01-10',
    lastActive: 'Just now',
    avatarInitials: 'RK',
    phone: '+91 98201 12345',
    isCurrentUser: true,
  },
  {
    id: 'user_002',
    name: 'Priya Sharma',
    email: 'priya.sharma@apexoutdoor.com',
    role: 'Manager',
    status: 'Active',
    joinedDate: '2023-04-18',
    lastActive: '2 hours ago',
    avatarInitials: 'PS',
    phone: '+91 98201 67890',
  },
  {
    id: 'user_003',
    name: 'Amit Patel',
    email: 'amit.patel@apexoutdoor.com',
    role: 'Viewer',
    status: 'Active',
    joinedDate: '2024-02-01',
    lastActive: 'Yesterday',
    avatarInitials: 'AP',
    phone: '+91 98201 44556',
  },
];

export const CANONICAL_TEAM_INVITATIONS: TeamInvitation[] = [
  {
    id: 'inv_001',
    email: 'vikram.singh@apexoutdoor.com',
    name: 'Vikram Singh',
    role: 'Manager',
    sentDate: '2026-10-04',
    expiresDate: '2026-10-11',
    invitedBy: 'Rajesh Kumar',
  },
  {
    id: 'inv_002',
    email: 'neha.deshmukh@apexoutdoor.com',
    name: 'Neha Deshmukh',
    role: 'Viewer',
    sentDate: '2026-10-05',
    expiresDate: '2026-10-12',
    invitedBy: 'Rajesh Kumar',
  },
];

export const ROLE_PERMISSIONS_SUMMARY: Record<
  TeamRole,
  {
    title: string;
    description: string;
    permissions: string[];
    badgeVariant: 'brand' | 'active' | 'inactive';
  }
> = {
  Owner: {
    title: 'Provider Owner',
    description: 'Full organizational authority over financial, legal, and operational workflows.',
    badgeVariant: 'brand',
    permissions: [
      'Manage team members, roles, and invitation revocations',
      'Manage subscription quotas, plan upgrades, and billing invoices',
      'Sign and review bilateral Marketplace Agreements',
      'Toggle public Marketplace participation per resource',
      'Approve final Campaign Mounting Photo Proofs (POP)',
      'Edit corporate legal identity, address, and GSTIN credentials',
    ],
  },
  Manager: {
    title: 'Operations Manager',
    description: 'Operational control over catalog, availability engine, holds, and field execution.',
    badgeVariant: 'active',
    permissions: [
      'Register and edit physical advertising display specifications',
      'Place and clear operational Provider Calendar Blocks',
      'Accept or decline incoming client booking inquiries',
      'Dispatch mounting crew work orders and upload photo proofs',
      'Manage Customer CRM records and direct local agency accounts',
      'Read-only view of subscription status and marketplace agreements',
    ],
  },
  Viewer: {
    title: 'Staff / Read-Only Viewer',
    description: 'Read-only visibility across display availability, catalog specifications, and customer records.',
    badgeVariant: 'inactive',
    permissions: [
      'View catalog of physical static advertising resources',
      'View real-time availability calendar schedules and holds',
      'View customer directory and contact information',
      'Cannot edit resources, confirm bookings, or modify organization settings',
    ],
  },
};
