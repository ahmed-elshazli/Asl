import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '../api/adminDashboardApi';

export const adminDashboardKeys = {
  all: ['adminDashboard'] as const,
  overview: () => [...adminDashboardKeys.all, 'overview'] as const,
  growth: () => [...adminDashboardKeys.all, 'growth'] as const,
  activity: () => [...adminDashboardKeys.all, 'activity'] as const,
};

export function useAdminOverview() {
  return useQuery({
    queryKey: adminDashboardKeys.overview(),
    queryFn: adminDashboardApi.getOverview,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAdminGrowth() {
  return useQuery({
    queryKey: adminDashboardKeys.growth(),
    queryFn: adminDashboardApi.getGrowth,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminActivity() {
  return useQuery({
    queryKey: adminDashboardKeys.activity(),
    queryFn: adminDashboardApi.getActivity,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
