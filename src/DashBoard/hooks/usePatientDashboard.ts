import { useQuery } from '@tanstack/react-query';
import { patientDashboardApi } from '../api/patientDashboardApi';
import { useAuthStore } from '../../store/authStore';

export const usePatientDashboard = (userId: string | 'me') => {
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['patient-dashboard', userId],
    queryFn: async () => {
      if (userId === 'me') {
        return patientDashboardApi.getMyDashboard();
      } else {
        return patientDashboardApi.getPatientDashboard(userId);
      }
    },
    // Only enable if we have a valid userId, or if we are requesting 'me' and we are logged in
    enabled: userId === 'me' ? !!currentUser : !!userId,
  });
};

export const useWeightHistory = () => {
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['patient-dashboard', 'weight-history'],
    queryFn: () => patientDashboardApi.getWeightHistory(),
    enabled: !!currentUser,
  });
};
