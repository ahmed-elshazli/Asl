import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userTrainingProgramApi } from '../api/userTrainingProgramApi';

// ==========================================
// Hooks - User Training Programs
// ==========================================

const KEYS = {
  all: ['userTrainingPrograms'] as const,
  byUser: (userId: string) => [...KEYS.all, 'user', userId] as const,
  byProgram: (programId: string) => [...KEYS.all, 'program', programId] as const,
};

export function useAssignProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userTrainingProgramApi.assignProgram,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.byUser(variables.userId) });
      queryClient.invalidateQueries({ queryKey: KEYS.byProgram(variables.programId) });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'فشل في تعيين البرنامج';
      alert(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useAllUserPrograms() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => userTrainingProgramApi.getAllUserPrograms(),
  });
}

export function useUserPrograms(userId: string) {
  return useQuery({
    queryKey: KEYS.byUser(userId),
    queryFn: () => userTrainingProgramApi.getUserPrograms(userId),
    enabled: !!userId,
  });
}

export function useProgramUsers(programId: string) {
  return useQuery({
    queryKey: KEYS.byProgram(programId),
    queryFn: () => userTrainingProgramApi.getProgramUsers(programId),
    enabled: !!programId,
  });
}

export function useUnassignProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, programId }: { userId: string; programId: string }) =>
      userTrainingProgramApi.unassignProgram(userId, programId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.byUser(variables.userId) });
      queryClient.invalidateQueries({ queryKey: KEYS.byProgram(variables.programId) });
    },
    onError: (error: any) => {
      // سيتم التعامل مع الخطأ داخل المكون
      console.error("فشل في إلغاء البرنامج", error);
    },
  });
}
