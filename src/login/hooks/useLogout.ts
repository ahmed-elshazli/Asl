import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogoutCleanup = () => {
    // 1. مسح بيانات المستخدم والتوكن من الـ Zustand
    clearAuth();
    // 2. تدمير كل الكاش بتاع الـ React Query عشان مفيش داتا قديمة تـ refetch وتضرب 401
    queryClient.clear();
    // 3. توجيه المريض بسلام بدون إعادة تحميل الصفحة
    navigate('/login', { replace: true });
  };

  return useMutation({
    mutationFn: () => authApi.logout(user?.id || ''),
    onSuccess: () => {
      handleLogoutCleanup();
      toast.success('تم تسجيل الخروج بنجاح');
    },
    onError: () => {
      // حتى لو السيرفر فشل (مثلا التوكن منتهي أصلا)، بنطلعه محلياً برضه
      handleLogoutCleanup();
    }
  });
};
