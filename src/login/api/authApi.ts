import api from '../../lib/api';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  phone: string;
  country: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role?: string;
  };
  message?: string;
}

export const authApi = {
  /**
   * دالة التسجيل (إنشاء حساب جديد)
   */
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * دالة تسجيل الدخول
   */
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * جلب بيانات الملف الشخصي للمستخدم الحالي
   */
  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile');
    const raw = response.data;
    console.log("=== RAW PROFILE RESPONSE ===", raw);
    const userObj = raw?.data?.user || raw?.user;
    if (userObj) return userObj;
    return raw?.data || raw;
  },

  /**
   * دالة تسجيل الخروج
   */
  logout: async (userId: string): Promise<any> => {
    const response = await api.post(`/auth/logout/${userId}`);
    return response.data;
  },

  /**
   * دالة نسيت كلمة المرور
   */
  forgotPassword: async (email: string): Promise<any> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * دالة التحقق من كود الاسترداد
   */
  verifyResetCode: async (resetCode: string): Promise<any> => {
    const response = await api.post('/auth/verify-reset-code', { resetCode });
    return response.data;
  },

  /**
   * دالة إعادة تعيين كلمة المرور
   */
  resetPassword: async (email: string, newPassword: string): Promise<any> => {
    const response = await api.patch('/auth/reset-password', { email, newPassword });
    return response.data;
  },

};
