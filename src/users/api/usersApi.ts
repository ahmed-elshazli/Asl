import api from '../../lib/api';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  age?: number;
  country?: string;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  [key: string]: any;
}

export const usersApi = {
  /**
   * جلب بيانات مستخدم محدد (الملف الشخصي للمريض)
   */
  getUserById: async (id: string): Promise<UserProfile> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * تحديث بيانات المستخدم (تعديل الملف الشخصي)
   */
  updateUser: async (id: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  /**
   * تغيير كلمة المرور
   */
  changePassword: async (data: any): Promise<any> => {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },
};
