import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('تم إرسال كود الاسترداد إلى بريدك الإلكتروني', {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء طلب إعادة تعيين كلمة المرور. تأكد من البريد الإلكتروني.');
    }
  });
};
