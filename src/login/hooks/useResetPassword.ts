import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ email, newPassword }: { email: string; newPassword: string }) => 
      authApi.resetPassword(email, newPassword),
    onSuccess: () => {
      toast.success('تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.', {
        duration: 3000,
      });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.');
    }
  });
};
