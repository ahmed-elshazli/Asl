import { useState } from 'react';
import { authApi } from '../api/authApi';
import type { RegisterPayload, AuthResponse } from '../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

interface UseRegisterReturn {
  register: (data: RegisterPayload) => Promise<AuthResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const register = async (data: RegisterPayload): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);

      // ✅ accessToken مش token
      const token = response.accessToken;

      if (token && response.user) {
        setAuth(
          {
            id:        response.user.id,
            email:     response.user.email,
            fullName:  response.user.fullName,
            role:      response.user.role as 'patient' | 'doctor' | 'admin',
            phone:     (response.user as any).phone,
            gender:    (response.user as any).gender,
            age:       (response.user as any).age,
            height:    (response.user as any).height,
            weight:    (response.user as any).weight,
            country:   (response.user as any).country,
            images:    (response.user as any).images,
            isActive:  (response.user as any).isActive,
            createdAt: (response.user as any).createdAt,
          },
          token,
        );
      }

      toast.success('تم إنشاء الحساب بنجاح! 🎉', {
        description: 'مرحباً بك في أصِل',
      });

      return response;
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage.join(' | ')
        : serverMessage || 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.';

      setError(errorMessage);
      toast.error('فشل التسجيل', { description: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};