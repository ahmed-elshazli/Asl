import { useQuery } from '@tanstack/react-query';
import { plansApi } from '../api/plansApi';
import { useAuthStore } from '../../store/authStore';


// ==========================================
// Hook لجلب الخطط الغذائية للمستخدم الحالي
// ==========================================
export const useMyPlans = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['plans', 'client', user?.id],
    queryFn: () => plansApi.getMyPlans(),
    enabled: !!user?.id, // ميشتغلش غير لما يكون فيه يوزر مسجل
    meta: { errorMessage: 'فشل تحميل الخطط الغذائية' },
  });
};

// ==========================================
// Hook لجلب خطة غذائية واحدة بالـ ID
// ==========================================
export const usePlan = (planId: string | null) => {
  return useQuery({
    queryKey: ['plans', planId],
    queryFn: () => plansApi.getById(planId!),
    enabled: !!planId, // ميشتغلش غير لما يكون فيه ID
    meta: { errorMessage: 'فشل تحميل الخطة الغذائية' },
  });
};

// ==========================================
// Hook لجلب كل الخطط الغذائية
// ==========================================
export const useAllPlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => plansApi.getAll(),
    meta: { errorMessage: 'فشل تحميل الخطط الغذائية' },
  });
};
