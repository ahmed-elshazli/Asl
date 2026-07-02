import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../store/authStore';

export const useProfile = () => {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
};
