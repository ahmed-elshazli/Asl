import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviewsApi';
import { toast } from 'sonner';

export const useAllReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'admin'],
    queryFn: () => reviewsApi.getAll(),
  });
};

export const useToggleReviewPublish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.togglePublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
      toast.success('تم تغيير حالة التقييم بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تغيير حالة التقييم');
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
      toast.success('تم حذف التقييم بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف التقييم');
    }
  });
};

export const useReviewStatistics = () => {
  return useQuery({
    queryKey: ['reviews', 'statistics'],
    queryFn: () => reviewsApi.getStatistics(),
  });
};
