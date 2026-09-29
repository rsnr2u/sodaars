import { organizationService } from './organizationService';
import { subscriptionService } from './subscriptionService';
import type { Organization } from '../types/organization';
import type { SubscriptionPlan } from '../types/subscription';

export interface DashboardMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  suspendedOrganizations: number;
  inactiveOrganizations: number;
  totalPlans: number;
  activePlans: number;
  recentOrganizations: Organization[];
  plansList: SubscriptionPlan[];
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    // Perform parallel requests against existing, unmodified admin endpoints
    const [
      totalRes,
      activeRes,
      suspendedRes,
      inactiveRes,
      plansRes,
      recentRes,
    ] = await Promise.all([
      organizationService.getOrganizations({ per_page: 1 }),
      organizationService.getOrganizations({ status: 'ACTIVE', per_page: 1 }),
      organizationService.getOrganizations({ status: 'SUSPENDED', per_page: 1 }),
      organizationService.getOrganizations({ status: 'INACTIVE', per_page: 1 }),
      subscriptionService.getPlans(),
      organizationService.getOrganizations({ per_page: 6 }),
    ]);

    const plans = plansRes || [];
    const activePlans = plans.filter((p) => p.status === 'ACTIVE').length;

    return {
      totalOrganizations: totalRes.pagination.total,
      activeOrganizations: activeRes.pagination.total,
      suspendedOrganizations: suspendedRes.pagination.total,
      inactiveOrganizations: inactiveRes.pagination.total,
      totalPlans: plans.length,
      activePlans,
      recentOrganizations: recentRes.items || [],
      plansList: plans,
    };
  },
};

export default dashboardService;
