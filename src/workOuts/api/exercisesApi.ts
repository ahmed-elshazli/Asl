import api from '../../lib/api';

// ==========================================
// Types - التمارين
// ==========================================

export interface Exercise {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  duration?: number;
  calories?: number;
  images?: string[];
  sets?: number;
  reps?: number;
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // للحقول الإضافية اللي ممكن ترجع من الباك إند
}

export interface CreateExercisePayload {
  title: string;
  description?: string;
  duration?: number;
  calories?: number;
}

export type UpdateExercisePayload = Partial<CreateExercisePayload>;

// ==========================================
// API Calls - التمارين
// ==========================================

export const exercisesApi = {
  /** جلب كل التمارين */
  getAll: async (): Promise<Exercise[]> => {
    const response = await api.get('/exercises');
    return response.data?.data ?? response.data;
  },

  /** جلب تمرين واحد بالـ ID */
  getById: async (id: string): Promise<Exercise> => {
    const response = await api.get(`/exercises/${id}`);
    return response.data?.data ?? response.data;
  },

  /** POST /exercises — إنشاء تمرين جديد */
  create: async (payload: CreateExercisePayload | FormData): Promise<Exercise> => {
    const config = payload instanceof FormData ? { headers: { 'Content-Type': undefined } } : {};
    const response = await api.post('/exercises', payload, config);
    return response.data?.data ?? response.data;
  },

  /** PATCH /exercises/{id} — تحديث تمرين */
  updateById: async (id: string, payload: UpdateExercisePayload | FormData): Promise<Exercise> => {
    const config = payload instanceof FormData ? { headers: { 'Content-Type': undefined } } : {};
    const response = await api.patch(`/exercises/${id}`, payload, config);
    return response.data?.data ?? response.data;
  },

  /** DELETE /exercises/{id} — حذف تمرين */
  deleteById: async (id: string): Promise<void> => {
    await api.delete(`/exercises/${id}`);
  },
};
