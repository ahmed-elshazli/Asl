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
  updateUser: async (_id: string, data: Partial<UserProfile> | FormData): Promise<UserProfile> => {
    let payload = data;
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
    
    if (!(data instanceof FormData)) {
      payload = { ...data };
      delete (payload as any).images; // الباك إند يرفض وجود هذا الحقل في حالة JSON
    }
    
    const response = await api.patch('/users/update-profile', payload, config);
    const raw = response.data;
    return raw?.user?.user || raw?.user || raw?.data || raw;
  },

  /**
   * تغيير كلمة المرور
   */
  changePassword: async (data: any): Promise<any> => {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },
};
