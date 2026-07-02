import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutUsApi, type AboutUs } from '../api/aboutUsApi';
import { toast } from 'sonner';

export const useAboutUs = () => {
  return useQuery({
    queryKey: ['about-us'],
    queryFn: () => aboutUsApi.get(),
    retry: false,
  });
};

export const useSaveAboutUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<AboutUs>) => {
      // إذا كان موجود من قبل يتم التعديل، وإلا إنشاء
      const existing = await aboutUsApi.get();
      if (existing && (existing.id || existing._id)) {
        return aboutUsApi.update(payload);
      }
      return aboutUsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-us'] });
      toast.success('تم الحفظ بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  });
};
