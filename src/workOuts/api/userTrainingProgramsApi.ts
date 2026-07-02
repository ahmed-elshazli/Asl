import api from '../../lib/api';
import type { TrainingProgram } from './trainingProgramsApi';

// ==========================================
// Types - برامج المستخدم التدريبية
// ==========================================

export interface UserTrainingProgram {
  _id: string;
  user: string;
  program: TrainingProgram | string;
  progress?: number;
  completedExercises?: string[];
  startDate?: string;
  [key: string]: any;
}

// ==========================================
// API Calls - برامج تدريب المستخدم
// ==========================================

export const userTrainingProgramsApi = {
  /** جلب البرامج التدريبية المخصصة للمستخدم الحالي (المريض) */
  getMyPrograms: async (): Promise<UserTrainingProgram[]> => {
    const response = await api.get<UserTrainingProgram[]>('/user-training-program/my-programs');
    return response.data;
  },

  /** وضع علامة "مكتمل" على تمرين داخل برنامج معين */
  completeExercise: async (programId: string, exerciseId: string): Promise<UserTrainingProgram> => {
    const response = await api.patch<UserTrainingProgram>(`/user-training-program/${programId}/complete-exercise`, {
      exerciseId, // نفترض أن الباك إند يستقبل الـ exerciseId في الـ body
    });
    return response.data;
  },
};
