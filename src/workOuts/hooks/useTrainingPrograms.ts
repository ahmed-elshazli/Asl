import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingProgramsApi } from '../api/trainingProgramsApi';
import type { CreateTrainingProgramPayload, UpdateTrainingProgramPayload } from '../api/trainingProgramsApi';
import { userTrainingProgramsApi } from '../api/userTrainingProgramsApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

// ==========================================
// Hooks - البرامج التدريبية العامة
// ==========================================

export const useTrainingPrograms = () => {
  return useQuery({
    queryKey: ['training-programs'],
    queryFn: () => trainingProgramsApi.getAll(),
    meta: { errorMessage: 'فشل تحميل البرامج التدريبية' },
  });
};

export const useTrainingProgram = (id: string | null) => {
  return useQuery({
    queryKey: ['training-programs', id],
    queryFn: () => trainingProgramsApi.getById(id!),
    enabled: !!id,
    meta: { errorMessage: 'فشل تحميل تفاصيل البرنامج التدريبي' },
  });
};

// ==========================================
// Mutations - إنشاء وتعديل وحذف البرامج التدريبية
// ==========================================

export const useCreateTrainingProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTrainingProgramPayload) => trainingProgramsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      toast.success('تم إضافة البرنامج التدريبي بنجاح');
    },
    onError: () => toast.error('فشل إضافة البرنامج'),
  });
};

export const useUpdateTrainingProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTrainingProgramPayload }) => trainingProgramsApi.updateById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      toast.success('تم تحديث البرنامج بنجاح');
    },
    onError: () => toast.error('فشل تحديث البرنامج'),
  });
};

export const useDeleteTrainingProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trainingProgramsApi.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      toast.success('تم حذف البرنامج بنجاح');
    },
    onError: () => toast.error('فشل حذف البرنامج'),
  });
};

// ==========================================
// Hooks - برامج المستخدم التدريبية المخصصة (Patient)
// ==========================================

export const useMyTrainingPrograms = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['user-training-programs', 'client', user?.id],
    queryFn: () => userTrainingProgramsApi.getMyPrograms(),
    enabled: !!user?.id, // يعمل فقط لو فيه يوزر مسجل
    meta: { errorMessage: 'فشل تحميل برامجك التدريبية المخصصة' },
  });
};

export const useCompleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, exerciseId }: { programId: string; exerciseId: string }) => 
      userTrainingProgramsApi.completeExercise(programId, exerciseId),
    onSuccess: () => {
      // تحديث البيانات بعد اكتمال التمرين لتحديث شريط التقدم
      queryClient.invalidateQueries({ queryKey: ['user-training-programs'] });
      toast.success('تم إنهاء التمرين بنجاح! عاش يا بطل 💪');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حفظ التقدم');
    }
  });
};
