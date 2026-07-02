import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

export const useVerifyResetCode = () => {
  return useMutation({
    mutationFn: (resetCode: string) => authApi.verifyResetCode(resetCode),
    onSuccess: () => {
      toast.success('تم التحقق من الكود بنجاح. يمكنك الآن تعيين كلمة مرور جديدة.', {
        duration: 3000,
      });
    },
    onError: () => {
      toast.error('الكود غير صحيح أو منتهي الصلاحية.');
    }
  });
};
