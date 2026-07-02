import api from '../../lib/api';

// ==========================================
// Types - الخطط الغذائية
// ==========================================

export interface NutritionPlan {
  _id: string;
  title?: string;
  description?: string;
  clientId?: string;
  meals?: any[];
  totalCalories?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // للحقول الإضافية اللي ممكن ترجع من الباك إند
}

// ==========================================
// API Calls - الخطط الغذائية
// ==========================================

export const plansApi = {
  /** جلب كل الخطط الغذائية */
  getAll: async (): Promise<NutritionPlan[]> => {
    const response = await api.get<NutritionPlan[]>('/plans');
    return response.data;
  },

  /** جلب خطط غذائية لمريض معين */
  getByClientId: async (clientId: string): Promise<NutritionPlan[]> => {
    try {
      // 1. المحاولة بالمسار المخصص
      const response = await api.get(`/plans/client/${clientId}`);
      const result = response.data?.data ?? response.data;
      const parsed = Array.isArray(result) ? result : (result?.data ?? []);
      if (parsed.length > 0) return parsed;
    } catch (error) {
      console.log('Error fetching from /plans/client, trying fallback...');
    }
      
    // 2. المحاولة كبديل من المسار العام مع الفلترة
    try {
      const fallbackResponse = await api.get(`/plans?limit=100`);
      const fallbackResult = fallbackResponse.data?.data ?? fallbackResponse.data;
      const allPlans = Array.isArray(fallbackResult) ? fallbackResult : (fallbackResult?.data ?? []);
      return allPlans.filter((p: any) => {
        const pId = typeof p.patient === 'object' ? (p.patient?._id || p.patient?.id) : p.patient;
        const cId = typeof p.clientId === 'object' ? (p.clientId?._id || p.clientId?.id) : p.clientId;
        return pId === clientId || cId === clientId;
      });
    } catch (fallbackError) {
      return [];
    }
  },

  /** جلب خطة غذائية واحدة */
  getById: async (id: string): Promise<NutritionPlan> => {
    const response = await api.get<NutritionPlan>(`/plans/${id}`);
    return response.data;
  },

  /** جلب خطط المريض الحالي (my-plans) */
  getMyPlans: async (): Promise<NutritionPlan[]> => {
    try {
      const response = await api.get(`/plans/my-plans`);
      const result = response.data?.data ?? response.data;
      const parsed = Array.isArray(result) ? result : (result?.data ?? []);
      return parsed;
    } catch (error) {
      console.error('Error fetching my plans:', error);
      return [];
    }
  }
};
