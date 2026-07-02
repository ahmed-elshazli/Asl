import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

export const useLogout = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(user!.id),
    onSuccess: () => {
      // حذف التوكن والبيانات من الـ Zustand / LocalStorage
      clearAuth();
      toast.success('تم تسجيل الخروج بنجاح');
      
      // التوجيه التلقائي للصفحة الرئيسية ممكن يتعمل في الـ Navbar 
      // أو عن طريق window.location هنا
      window.location.href = '/';
    },
    onError: () => {
      // حتى لو السيرفر فشل، ممكن نطلعه محلياً برضه
      clearAuth();
      window.location.href = '/';
    }
  });
};
