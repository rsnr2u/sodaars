import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import type { Organization } from '../../types/organization';
import type { OrganizationMember, OrganizationInvitation } from '../../types/team';
import type { Subscription, SubscriptionPlan } from '../../types/subscription';
import organizationService from '../../services/organizationService';
import teamService from '../../services/teamService';
import subscriptionService from '../../services/subscriptionService';
import resourceService from '../../services/resourceService';
import { getApiErrorMessage } from '../../services/api';

import OrganizationProfileForm from '../../components/settings/OrganizationProfileForm';
import OperationalSettingsForm from '../../components/settings/OperationalSettingsForm';
import DirectoryVisibilityCard from '../../components/settings/DirectoryVisibilityCard';
import TeamRosterTable from '../../components/settings/TeamRosterTable';
import TeamInvitationsTable from '../../components/settings/TeamInvitationsTable';
import InviteMemberModal from '../../components/settings/InviteMemberModal';
import SubscriptionOverviewCard from '../../components/settings/SubscriptionOverviewCard';
import PlanComparisonGrid from '../../components/settings/PlanComparisonGrid';

import {
  Building2,
  Briefcase,
  Globe,
  Users,
  CreditCard,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

type SettingsTab = 'profile' | 'operational' | 'directory' | 'team' | 'subscription';

export const SettingsPage: React.FC = () => {
  const { role, activeOrg, user } = useAuth();
  const { error: showError } = useToast();

  // Strict RBAC: Staff is completely restricted from Settings
  const isAllowed = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';
  const isOwner = role === 'PROVIDER_OWNER';

  const [currentTab, setCurrentTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(true);

  // Core Data States
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeResourceCount, setActiveResourceCount] = useState<number>(0);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const loadSettingsData = useCallback(async () => {
    if (!isAllowed) return;

    try {
      setIsLoading(true);

      const [orgData, membersData, invitationsData, plansData, resourcesData] =
        await Promise.allSettled([
          organizationService.getProfile(),
          teamService.getMembers(),
          teamService.getInvitations(),
          subscriptionService.getSubscriptionPlans(),
          resourceService.getResources({ per_page: 1 }),
        ]);

      if (orgData.status === 'fulfilled') {
        setOrganization(orgData.value);
        if (orgData.value.active_subscription) {
          setSubscription(orgData.value.active_subscription);
        }
      }

      if (membersData.status === 'fulfilled') {
        setMembers(membersData.value);
      }

      if (invitationsData.status === 'fulfilled') {
        setInvitations(invitationsData.value);
      }

      if (plansData.status === 'fulfilled') {
        setPlans(plansData.value);
      }

      if (resourcesData.status === 'fulfilled' && resourcesData.value.pagination) {
        setActiveResourceCount(resourcesData.value.pagination.total || 0);
      }
    } catch (err) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [isAllowed, showError]);

  useEffect(() => {
    loadSettingsData();
  }, [loadSettingsData]);

  if (!isAllowed) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto 0' }}>
        <EmptyState
          icon={<ShieldAlert size={32} style={{ color: 'var(--rose-500)' }} />}
          title="Access Restricted"
          description="Your current role (PROVIDER_STAFF) does not have permission to manage organization settings. Please contact your organization owner or manager for assistance."
          action={
            <Link to="/dashboard" className="btn btn-secondary btn-md">
              <ArrowLeft size={16} />
              <span>Return to Dashboard</span>
            </Link>
          }
        />
      </div>
    );
  }

  const roleLabel = role ? role.replace('PROVIDER_', '') : 'MEMBER';

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1>Organization Settings</h1>
            <Badge variant={isOwner ? 'orange' : 'info'}>{roleLabel}</Badge>
          </div>
          <p>
            Configure legal entity details, operational preferences, public directory visibility, team members, and licensing quota for{' '}
            <strong>{organization?.name || activeOrg?.trading_name || activeOrg?.name}</strong>.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: currentTab === 'profile' ? '2px solid var(--navy-700)' : '2px solid transparent',
            color: currentTab === 'profile' ? 'var(--navy-900)' : 'var(--text-muted)',
            fontWeight: currentTab === 'profile' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Building2 size={16} />
          <span>General Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('operational')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: currentTab === 'operational' ? '2px solid var(--navy-700)' : '2px solid transparent',
            color: currentTab === 'operational' ? 'var(--navy-900)' : 'var(--text-muted)',
            fontWeight: currentTab === 'operational' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Briefcase size={16} />
          <span>Commercial & Ops</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('directory')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: currentTab === 'directory' ? '2px solid var(--navy-700)' : '2px solid transparent',
            color: currentTab === 'directory' ? 'var(--navy-900)' : 'var(--text-muted)',
            fontWeight: currentTab === 'directory' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Globe size={16} />
          <span>Directory & Visibility</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('team')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: currentTab === 'team' ? '2px solid var(--navy-700)' : '2px solid transparent',
            color: currentTab === 'team' ? 'var(--navy-900)' : 'var(--text-muted)',
            fontWeight: currentTab === 'team' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Users size={16} />
          <span>Team & Access ({members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('subscription')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: currentTab === 'subscription' ? '2px solid var(--navy-700)' : '2px solid transparent',
            color: currentTab === 'subscription' ? 'var(--navy-900)' : 'var(--text-muted)',
            fontWeight: currentTab === 'subscription' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
          }}
        >
          <CreditCard size={16} />
          <span>Subscription & Quota</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {isLoading && !organization ? (
        <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
          <Spinner size={36} />
        </div>
      ) : (
        <>
          {/* TAB 1: General Profile */}
          {currentTab === 'profile' && organization && (
            <OrganizationProfileForm
              organization={organization}
              isOwner={isOwner}
              onOrganizationUpdated={(updated) => setOrganization(updated)}
            />
          )}

          {/* TAB 2: Commercial & Ops */}
          {currentTab === 'operational' && organization && (
            <OperationalSettingsForm
              organization={organization}
              isOwner={isOwner}
              onOrganizationUpdated={(updated) => setOrganization(updated)}
            />
          )}

          {/* TAB 3: Directory & Visibility */}
          {currentTab === 'directory' && organization && (
            <DirectoryVisibilityCard
              organization={organization}
              isOwner={isOwner}
              onVisibilityChanged={(updated) => setOrganization(updated)}
            />
          )}

          {/* TAB 4: Team & Access */}
          {currentTab === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TeamRosterTable
                members={members}
                currentActorRole={role!}
                currentUserId={user?.id}
                isLoading={isLoading}
                onMemberUpdated={(updated) => {
                  setMembers((prev) =>
                    prev.map((m) => (m.id === updated.id ? updated : m))
                  );
                }}
                onMemberRemoved={(membershipId) => {
                  setMembers((prev) => prev.filter((m) => m.id !== membershipId));
                }}
                onOpenInvite={() => setIsInviteModalOpen(true)}
              />

              <TeamInvitationsTable
                invitations={invitations}
                isLoading={isLoading}
                onInvitationRevoked={(uuid) => {
                  setInvitations((prev) =>
                    prev.map((inv) =>
                      inv.uuid === uuid ? { ...inv, status: 'REVOKED' } : inv
                    )
                  );
                }}
                onOpenInvite={() => setIsInviteModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 5: Subscription & Quota */}
          {currentTab === 'subscription' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SubscriptionOverviewCard
                subscription={subscription}
                activeResourceCount={activeResourceCount}
                isLoading={isLoading}
              />

              <PlanComparisonGrid
                plans={plans}
                currentPlanSlug={subscription?.plan?.slug}
                isLoading={isLoading}
              />
            </div>
          )}
        </>
      )}

      {/* Dispatch Invitation Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        currentActorRole={role!}
        onInvitationSent={(newInvitation) => {
          setInvitations((prev) => [newInvitation, ...prev]);
        }}
      />
    </div>
  );
};

export default SettingsPage;
