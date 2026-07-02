import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import type { UserProfile } from '../api/usersApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

// ==========================================
// Hooks الخاصة بالمستخدمين (البيشنت)
// ==========================================

/**
 * هوك لجلب بيانات الملف الشخصي للمستخدم الحالي
 */
export const useMyProfile = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => usersApi.getUserById(user!.id),
    enabled: !!user?.id,
    meta: { errorMessage: 'فشل تحميل الملف الشخصي' },
  });
};

/**
 * هوك لتحديث بيانات الملف الشخصي
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => usersApi.updateUser(user!.id, data),
    onSuccess: () => {
      // تحديث الكاش بالبيانات الجديدة
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast.success('تم تحديث الملف الشخصي بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
    }
  });
};

/**
 * هوك لتغيير كلمة المرور
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: any) => usersApi.changePassword(data),
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    }
  });
};
