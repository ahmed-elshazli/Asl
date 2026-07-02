import api from '../../lib/api';

// ==========================================
// Types
// ==========================================
export interface NutritionPlan {
  id: string;
  name: string;
  type: string;
  calories: {
    from: number;
    to: number;
  };
  durationInWeeks: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  instructions: string;
  patient?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Meal {
  name: string;
  mealTime: string;
  calories: number;
  description: string;
}

export interface PlansResponse {
  results: number;
  pagination?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: NutritionPlan[];
}

export interface CreatePlanPayload {
  name: string;
  type: string;
  calories: {
    from: number;
    to: number;
  };
  durationInWeeks: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  instructions: string;
  patient?: string;
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>;

// ==========================================
// Helper
// ==========================================
const toPlan = (raw: any): NutritionPlan => ({
  ...raw,
  id: raw.id ?? raw._id,
});

// ==========================================
// API
// ==========================================
export const plansApi = {
  /** POST /plans — إنشاء خطة غذائية */
  create: async (payload: CreatePlanPayload): Promise<NutritionPlan> => {
    const response = await api.post('/plans', payload);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },

  /** GET /plans — جلب كل الخطط */
  getAll: async (page = 1, limit = 10): Promise<PlansResponse> => {
    const response = await api.get(`/plans?page=${page}&limit=${limit}`);
    const result = response.data;
    return {
      ...result,
      data: (result.data ?? []).map(toPlan),
    };
  },

  /** GET /plans/client/{id} — جلب خطط مريض معين */
  getByClientId: async (clientId: string): Promise<NutritionPlan[]> => {
    try {
      const response = await api.get(`/plans/client/${clientId}`);
      const result = response.data?.data ?? response.data;
      const parsed = Array.isArray(result) ? result : (result?.data ?? []);
      if (parsed.length > 0) return parsed.map(toPlan);
    } catch (error) {
      console.log('Error fetching from /plans/client, trying fallback...');
    }

    try {
      const fallbackResponse = await api.get(`/plans?limit=100`);
      const fallbackResult = fallbackResponse.data?.data ?? fallbackResponse.data;
      const allPlans = Array.isArray(fallbackResult) ? fallbackResult : (fallbackResult?.data ?? []);
      const filtered = allPlans.filter((p: any) => {
        const pId = typeof p.patient === 'object' ? (p.patient?._id || p.patient?.id) : p.patient;
        const cId = typeof p.clientId === 'object' ? (p.clientId?._id || p.clientId?.id) : p.clientId;
        return pId === clientId || cId === clientId;
      });
      return filtered.map(toPlan);
    } catch (fallbackError) {
      return [];
    }
  },

  /** GET /plans/{id} — جلب خطة واحدة */
  getById: async (id: string): Promise<NutritionPlan> => {
    const response = await api.get(`/plans/${id}`);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },

  /** PUT /plans/{id} — تحديث خطة */
  updateById: async (id: string, payload: UpdatePlanPayload): Promise<NutritionPlan> => {
    const response = await api.put(`/plans/${id}`, payload);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },

  /** DELETE /plans/{id} — حذف خطة */
  deleteById: async (id: string): Promise<void> => {
    await api.delete(`/plans/${id}`);
  },
};