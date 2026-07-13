import api from '../../lib/api';

// ==========================================
// Types for /admin/dashboard/overview
// ==========================================

export interface UsersOverview {
  total: number;
  active: number;
  inactive: number;
  patients: number;
  doctors: number;
  admins: number;
  newToday: number;
  newThisMonth: number;
  averageAge: number;
  averageWeight: number;
}

export interface SubscriptionsOverview {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
  newThisMonth: number;
  expiringSoon: number;
}

export interface SubscriptionPlansOverview {
  total: number;
  active: number;
  inactive: number;
  popularPlan: string | null;
}

export interface RevenueByPlan {
  plan: string;
  revenue: number;
  subscribers: number;
}

export interface RevenueOverview {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueByPlan: RevenueByPlan[];
}

export interface DashboardOverview {
  users: UsersOverview;
  subscriptions: SubscriptionsOverview;
  subscriptionPlans: SubscriptionPlansOverview;
  revenue: RevenueOverview;
}

// ==========================================
// Types for /admin/dashboard/growth
// ==========================================

export interface GrowthPoint {
  year: number;
  month: number;
  users?: number;
  subscriptions?: number;
}

export interface DashboardGrowth {
  usersGrowth: GrowthPoint[];
  subscriptionsGrowth: GrowthPoint[];
}

// ==========================================
// Types for /admin/dashboard/activity
// ==========================================

export interface ActivityItem {
  type: 'USER_REGISTERED' | 'SUBSCRIPTION_CREATED' | 'REVIEW_ADDED' | 'WEIGHT_UPDATED';
  title: string;
  user?: any;
  plan?: any;
  rating?: number;
  weight?: number;
  createdAt: string;
}

export interface DashboardActivity {
  activities: ActivityItem[];
}

// ==========================================
// API calls
// ==========================================

export const adminDashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/admin/dashboard/overview');
    return response.data?.data || response.data;
  },

  getGrowth: async (): Promise<DashboardGrowth> => {
    const response = await api.get('/admin/dashboard/growth');
    return response.data?.data || response.data;
  },

  getActivity: async (): Promise<DashboardActivity> => {
    const response = await api.get('/admin/dashboard/activity');
    return response.data?.data || response.data;
  },
};
