import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exercisesApi } from '../api/exercisesApi';
import type { CreateExercisePayload, UpdateExercisePayload } from '../api/exercisesApi';
import { toast } from 'sonner';

// ==========================================
// Hook لجلب كل التمارين
// ==========================================
export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => exercisesApi.getAll(),
    meta: { errorMessage: 'فشل تحميل التمارين' },
  });
};

// ==========================================
// Hook لجلب تمرين واحد بالـ ID
// ==========================================
export const useExercise = (exerciseId: string | null) => {
  return useQuery({
    queryKey: ['exercises', exerciseId],
    queryFn: () => exercisesApi.getById(exerciseId!),
    enabled: !!exerciseId,
    meta: { errorMessage: 'فشل تحميل التمرين' },
  });
};

// ==========================================
// Mutations - إنشاء وتعديل وحذف
// ==========================================

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExercisePayload) => exercisesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('تم إضافة التمرين بنجاح');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message;
      const errorMsg = Array.isArray(msg) ? msg[0] : msg;
      toast.error(errorMsg || 'فشل إضافة التمرين');
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExercisePayload }) => exercisesApi.updateById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('تم تحديث التمرين بنجاح');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message;
      const errorMsg = Array.isArray(msg) ? msg[0] : msg;
      toast.error(errorMsg || 'فشل تحديث التمرين');
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => exercisesApi.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('تم حذف التمرين بنجاح');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message;
      const errorMsg = Array.isArray(msg) ? msg[0] : msg;
      toast.error(errorMsg || 'فشل حذف التمرين');
    },
  });
};
