import api from '../../lib/api';

// ==========================================
// Types - البرامج التدريبية العامة
// ==========================================

export interface TrainingProgram {
  _id: string;
  title?: string;
  description?: string;
  level?: string;
  category?: string;
  duration?: number;
  exercises?: any[]; // أو واجهة تمرين محددة
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CreateTrainingProgramPayload {
  title: string;
  description?: string;
  level?: string; // e.g., 'beginner', 'intermediate', 'advanced'
  category?: string;
  duration?: number;
  exercises?: { exerciseId: string; order?: number }[];
  isActive?: boolean;
  isPremium?: boolean;
  minCalories?: number;
  maxCalories?: number;
}

export type UpdateTrainingProgramPayload = Partial<CreateTrainingProgramPayload>;

// ==========================================
// API Calls - البرامج التدريبية
// ==========================================

export const trainingProgramsApi = {
  /** جلب كل البرامج التدريبية المتاحة (للتصفح) */
  getAll: async (): Promise<TrainingProgram[]> => {
    const response = await api.get('/training-programs');
    return response.data?.data ?? response.data;
  },

  /** جلب تفاصيل برنامج تدريبي واحد */
  getById: async (id: string): Promise<TrainingProgram> => {
    const response = await api.get(`/training-programs/${id}`);
    return response.data?.data ?? response.data;
  },

  /** POST /training-programs — إنشاء برنامج تدريبي جديد */
  create: async (payload: CreateTrainingProgramPayload): Promise<TrainingProgram> => {
    const response = await api.post('/training-programs', payload);
    return response.data?.data ?? response.data;
  },

  /** PATCH /training-programs/{id} — تحديث برنامج تدريبي */
  updateById: async (id: string, payload: UpdateTrainingProgramPayload): Promise<TrainingProgram> => {
    const response = await api.patch(`/training-programs/${id}`, payload);
    return response.data?.data ?? response.data;
  },

  /** DELETE /training-programs/{id} — حذف برنامج تدريبي */
  deleteById: async (id: string): Promise<void> => {
    await api.delete(`/training-programs/${id}`);
  },
};
