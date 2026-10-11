import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Mail,
  Edit2,
  Trash2,
  RotateCcw,
  Clock,
  Check,
  AlertCircle,
  UserX,
  Send,
  Shield,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/Table';
import {
  TeamMember,
  TeamInvitation,
  TeamRole,
  CANONICAL_TEAM_MEMBERS,
  CANONICAL_TEAM_INVITATIONS,
  ROLE_PERMISSIONS_SUMMARY,
} from '../../types/team';

const MEMBERS_STORAGE_KEY = 'sodaars_provider_team_members';
const INVITES_STORAGE_KEY = 'sodaars_provider_team_invites';

export const TeamManagementPage: React.FC = () => {
  // Members state
  const [members, setMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return CANONICAL_TEAM_MEMBERS;
  });

  // Invitations state
  const [invitations, setInvitations] = useState<TeamInvitation[]>(() => {
    try {
      const saved = localStorage.getItem(INVITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return CANONICAL_TEAM_INVITATIONS;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);

  // Invite Form fields
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Viewer'>('Manager');
  const [inviteError, setInviteError] = useState('');

  // Edit Role field
  const [selectedEditRole, setSelectedEditRole] = useState<'Manager' | 'Viewer'>('Manager');

  const handleSaveMembers = (updated: TeamMember[]) => {
    setMembers(updated);
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveInvites = (updated: TeamInvitation[]) => {
    setInvitations(updated);
    try {
      localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Invite submission
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');

    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) {
      setInviteError('Please enter a valid email address');
      return;
    }

    // Check if already in members or invitations
    if (members.some((m) => m.email.toLowerCase() === inviteEmail.trim().toLowerCase())) {
      setInviteError('A team member with this email already exists');
      return;
    }
    if (invitations.some((inv) => inv.email.toLowerCase() === inviteEmail.trim().toLowerCase())) {
      setInviteError('An invitation to this email address is already pending');
      return;
    }

    const newInvite: TeamInvitation = {
      id: `inv_${Date.now()}`,
      email: inviteEmail.trim(),
      name: inviteName.trim() || undefined,
      role: inviteRole,
      sentDate: new Date().toISOString().split('T')[0],
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invitedBy: 'Rajesh Kumar',
    };

    const updated = [newInvite, ...invitations];
    handleSaveInvites(updated);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
    showToast(`Invitation sent to ${newInvite.email}.`);
  };

  // Resend invitation
  const handleResendInvite = (inv: TeamInvitation) => {
    showToast(`Invitation re-sent to ${inv.email}.`);
  };

  // Revoke invitation
  const handleRevokeInvite = (invId: string) => {
    const updated = invitations.filter((i) => i.id !== invId);
    handleSaveInvites(updated);
    showToast('Pending invitation revoked.');
  };

  // Edit Role
  const handleOpenEditRole = (member: TeamMember) => {
    setEditingMember(member);
    setSelectedEditRole(member.role === 'Viewer' ? 'Viewer' : 'Manager');
  };

  const handleSaveRole = () => {
    if (!editingMember) return;
    const updated = members.map((m) =>
      m.id === editingMember.id ? { ...m, role: selectedEditRole as TeamRole } : m
    );
    handleSaveMembers(updated);
    setEditingMember(null);
    showToast(`Updated ${editingMember.name}'s role to ${selectedEditRole}.`);
  };

  // Remove Member
  const handleConfirmRemove = () => {
    if (!removingMember) return;
    const updated = members.filter((m) => m.id !== removingMember.id);
    handleSaveMembers(updated);
    setRemovingMember(null);
    showToast(`Removed ${removingMember.name} from the organization team.`);
  };

  const roleStats = {
    owners: members.filter((m) => m.role === 'Owner').length,
    managers: members.filter((m) => m.role === 'Manager').length,
    viewers: members.filter((m) => m.role === 'Viewer').length,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#171717] text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[#F97316] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Primary Actions Card */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1">
            <Users size={12} /> Organization Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Team Management & Staff Roster
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Invite personnel, assign role-based access permissions (Owner, Manager, Viewer), and manage active staff members.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            leftIcon={<UserPlus size={14} />}
          >
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Active Team Members
            </span>
            <Badge variant="active" size="sm">
              {members.length} Active
            </Badge>
          </div>
          <div className="text-2xl font-bold text-[#171717] mt-1">
            {members.length} Users
          </div>
          <div className="text-[11px] text-[#737373] mt-0.5">
            {roleStats.owners} Owner • {roleStats.managers} Manager • {roleStats.viewers} Viewer
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Pending Invitations
            </span>
            <Badge variant="brand" size="sm">
              {invitations.length} Pending
            </Badge>
          </div>
          <div className="text-2xl font-bold text-[#EA580C] mt-1">
            {invitations.length} Invites
          </div>
          <div className="text-[11px] text-[#737373] mt-0.5">
            Awaiting email acceptance &amp; verification
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Tenant Access Scope
            </span>
            <Badge variant="active" size="sm">
              Multi-User RBAC
            </Badge>
          </div>
          <div className="text-2xl font-bold text-[#171717] mt-1">
            Role-Based
          </div>
          <div className="text-[11px] text-[#737373] mt-0.5">
            Scoped strictly to Apex Media Networks
          </div>
        </div>
      </div>

      {/* Active Team Members Table */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users size={17} className="text-[#EA580C]" />
              <div>
                <h3 className="text-sm font-bold text-[#171717]">
                  Active Team Members ({members.length})
                </h3>
                <p className="text-[11px] text-[#737373]">
                  Internal staff personnel authenticated under your organization tenant.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-[#737373]">
              Only the <strong>Owner</strong> can modify roles or remove members.
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Assigned Role</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                {/* Member Avatar & Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EA580C]/10 text-[#EA580C] font-bold text-xs flex items-center justify-center border border-[#EA580C]/20 shrink-0">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                        {member.name}
                        {member.isCurrentUser && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-orange-100 text-[#EA580C]">
                            You
                          </span>
                        )}
                      </div>
                      {member.phone && (
                        <div className="text-[10px] text-[#737373]">{member.phone}</div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="text-xs text-[#525252]">
                  {member.email}
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge
                    variant={
                      member.role === 'Owner'
                        ? 'brand'
                        : member.role === 'Manager'
                        ? 'active'
                        : 'inactive'
                    }
                    size="sm"
                  >
                    {member.role}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant="active" size="sm">
                    {member.status}
                  </Badge>
                </TableCell>

                {/* Last Active */}
                <TableCell className="text-xs text-[#737373]">
                  <div className="flex items-center gap-1">
                    <Clock size={11} /> {member.lastActive}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  {member.role === 'Owner' ? (
                    <span className="text-[11px] text-[#737373] font-medium italic">
                      Primary Owner
                    </span>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditRole(member)}
                        leftIcon={<Edit2 size={12} />}
                        className="text-xs text-[#525252] hover:text-[#171717]"
                      >
                        Edit Role
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRemovingMember(member)}
                        leftIcon={<Trash2 size={12} />}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pending Invitations Section */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={17} className="text-[#EA580C]" />
              <div>
                <h3 className="text-sm font-bold text-[#171717]">
                  Pending Invitations ({invitations.length})
                </h3>
                <p className="text-[11px] text-[#737373]">
                  Invited colleagues who have not yet completed authentication registration.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
              leftIcon={<Send size={12} />}
            >
              New Invite
            </Button>
          </div>
        }
      >
        {invitations.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#737373]">
            No pending invitations. Click <strong>Invite Member</strong> above to invite new colleagues.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invited User / Email</TableHead>
                <TableHead>Designated Role</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-xs text-[#171717]">
                        {inv.name || inv.email.split('@')[0]}
                      </div>
                      <div className="text-[11px] text-[#737373]">{inv.email}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={inv.role === 'Manager' ? 'active' : 'inactive'} size="sm">
                      {inv.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-[#737373]">
                    {new Date(inv.sentDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>

                  <TableCell>
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Expires in 7 days
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-[#525252]">
                    {inv.invitedBy}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResendInvite(inv)}
                        leftIcon={<RotateCcw size={12} />}
                        className="text-xs text-[#EA580C] hover:text-[#C2410C]"
                      >
                        Resend
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeInvite(inv.id)}
                        leftIcon={<UserX size={12} />}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Revoke
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Role-Based Access Permissions (RBAC) Matrix Reference */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Shield size={17} className="text-[#EA580C]" />
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Role-Based Access Control (RBAC) Reference
              </h3>
              <p className="text-[11px] text-[#737373]">
                Permissions matrix enforced across the Provider Panel per Specification 07.
              </p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {(['Owner', 'Manager', 'Viewer'] as TeamRole[]).map((role) => {
            const roleInfo = ROLE_PERMISSIONS_SUMMARY[role];
            return (
              <div
                key={role}
                className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={roleInfo.badgeVariant} size="sm">
                      {role}
                    </Badge>
                    <span className="text-[10px] font-mono text-[#737373]">
                      provider_{role.toLowerCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#171717]">{roleInfo.title}</h4>
                  <p className="text-[11px] text-[#525252] leading-relaxed">
                    {roleInfo.description}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-[#E5E5E5]">
                    {roleInfo.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#262626]">
                        <Check size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setInviteError('');
        }}
        title="Invite New Team Member"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteError('');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendInvite}>
              Send Invitation
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
          <Input
            label="Colleague Email Address"
            type="email"
            required
            placeholder="colleague@apexoutdoor.com"
            value={inviteEmail}
            onChange={(e) => {
              setInviteEmail(e.target.value);
              setInviteError('');
            }}
            error={inviteError}
            leftElement={<Mail size={14} />}
            helperText="An invitation link will be dispatched to this corporate email address."
          />

          <Input
            label="Full Name (Optional)"
            placeholder="e.g. Vikram Singh"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              Assigned Access Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInviteRole('Manager')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  inviteRole === 'Manager'
                    ? 'bg-orange-50 border-[#EA580C] text-[#EA580C] shadow-xs'
                    : 'bg-white border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="font-bold text-xs text-[#171717]">Operations Manager</div>
                <div className="text-[10px] text-[#737373] mt-0.5">
                  Can create resources, place holds, accept bookings, and manage field crews.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInviteRole('Viewer')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  inviteRole === 'Viewer'
                    ? 'bg-orange-50 border-[#EA580C] text-[#EA580C] shadow-xs'
                    : 'bg-white border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="font-bold text-xs text-[#171717]">Read-Only Viewer</div>
                <div className="text-[10px] text-[#737373] mt-0.5">
                  Can view inventory schedules and customer CRM; cannot modify records.
                </div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-[11px] text-[#525252]">
            <strong>Security Notice:</strong> The invitation expires in 7 days. Only <strong>Provider Owner</strong> accounts have authority to grant or revoke organizational access.
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title={`Edit Role for ${editingMember?.name}`}
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveRole}>
              Update Role
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#FAFAF9] border border-[#E5E5E5] rounded-md">
            <div className="font-semibold text-xs text-[#171717]">{editingMember?.name}</div>
            <div className="text-[11px] text-[#737373]">{editingMember?.email}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              Select New Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedEditRole('Manager')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedEditRole === 'Manager'
                    ? 'bg-orange-50 border-[#EA580C] text-[#EA580C] shadow-xs'
                    : 'bg-white border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="font-bold text-xs text-[#171717]">Operations Manager</div>
                <div className="text-[10px] text-[#737373] mt-0.5">
                  Full operational control over catalog, schedules &amp; bookings.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEditRole('Viewer')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedEditRole === 'Viewer'
                    ? 'bg-orange-50 border-[#EA580C] text-[#EA580C] shadow-xs'
                    : 'bg-white border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="font-bold text-xs text-[#171717]">Read-Only Viewer</div>
                <div className="text-[10px] text-[#737373] mt-0.5">
                  Read-only view across inventory and customer directories.
                </div>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={!!removingMember}
        onClose={() => setRemovingMember(null)}
        title="Revoke Member Access"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setRemovingMember(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmRemove}>
              Revoke Access
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-900 flex items-start gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              Are you sure you want to remove <strong>{removingMember?.name}</strong> ({removingMember?.email}) from this organization?
            </div>
          </div>
          <p className="text-[#525252] leading-relaxed">
            Their login sessions will be immediately terminated, and their permissions to view or manage Apex Media Networks inventory will be completely revoked.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManagementPage;
