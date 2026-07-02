import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientReviewsApi, type CreateReviewDto } from '../api/patientReviewsApi';
import { toast } from 'sonner';

export const useMyReview = () => {
  return useQuery({
    queryKey: ['reviews', 'me'],
    queryFn: () => patientReviewsApi.getMyReview(),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewDto) => patientReviewsApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('تمت إضافة تقييمك بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إضافة التقييم');
    }
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewDto) => patientReviewsApi.updateReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('تم تحديث تقييمك بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث التقييم');
    }
  });
};

export const useDeleteMyReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => patientReviewsApi.deleteMyReview(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('تم حذف التقييم بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف التقييم');
    }
  });
};
