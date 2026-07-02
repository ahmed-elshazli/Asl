import api from '../../lib/api';

// ==========================================
// Types - تعيين البرامج للمستخدمين
// ==========================================

export interface AssignProgramPayload {
  userId: string;
  programId: string;
  durationInDays: number;
  repeatCount: number;
}

export interface UserTrainingProgram {
  _id: string;
  user: any; // يمكن تعديلها بنوع User من doctorUsersApi
  program: any; // يمكن تعديلها بنوع TrainingProgram من trainingProgramsApi
  status: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// API Calls - برامج المستخدمين
// ==========================================

export const userTrainingProgramApi = {
  /** POST /user-training-program/assign — تعيين برنامج لمريض */
  assignProgram: async (payload: AssignProgramPayload): Promise<any> => {
    const response = await api.post('/user-training-program/assign', payload);
    return response.data?.data ?? response.data;
  },

  /** GET /user-training-program — جلب كل برامج المستخدمين المعينة */
  getAllUserPrograms: async (): Promise<UserTrainingProgram[]> => {
    const response = await api.get('/user-training-program');
    return response.data?.data ?? response.data;
  },

  /** GET /user-training-program/user/{userId} — جلب برامج مريض معين */
  getUserPrograms: async (userId: string): Promise<UserTrainingProgram[]> => {
    const response = await api.get(`/user-training-program/user/${userId}`);
    return response.data?.data ?? response.data;
  },

  /** GET /user-training-program/program/{programId}/users — جلب المرضى المشتركين في برنامج */
  getProgramUsers: async (programId: string): Promise<any[]> => {
    const response = await api.get(`/user-training-program/program/${programId}/users`);
    return response.data?.data ?? response.data;
  },

  /** DELETE /user-training-program/{userId}/{programId} — إزالة تعيين برنامج من مريض */
  unassignProgram: async (userId: string, programId: string): Promise<void> => {
    await api.delete(`/user-training-program/${userId}/${programId}`);
  },
};
