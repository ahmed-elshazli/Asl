import { useState } from 'react';
import { authApi } from '../api/authApi';
import type { LoginPayload, AuthResponse } from '../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

interface UseLoginReturn {
  login: (data: LoginPayload) => Promise<AuthResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (data: LoginPayload): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data);

      const token = response.accessToken;

      if (token && response.user) {
        // ✅ بنبني الـ user object بشكل صريح يطابق الـ interface
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

      toast.success('تم تسجيل الدخول بنجاح! 👋', {
        description: `مرحباً ${response.user?.fullName}`,
      });

      return response;
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage.join(' | ')
        : serverMessage || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.';

      setError(errorMessage);
      toast.error('فشل تسجيل الدخول', { description: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};