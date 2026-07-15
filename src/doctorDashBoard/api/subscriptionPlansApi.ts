import api from '../../lib/api';

// ==========================================
// Types
// ==========================================

export interface SubscriptionPlan {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  billingCycle: string;
  durationInDays: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  description?: string;
  price: number;
  billingCycle: string;
  durationInDays: number;
  features: string[];
  isPopular?: boolean;
}

export type UpdateSubscriptionPlanPayload = Partial<CreateSubscriptionPlanPayload>;

// ==========================================
// Helper
// ==========================================

const toPlan = (raw: any): SubscriptionPlan => ({
  ...raw,
  id: raw.id ?? raw._id,
});

// ==========================================
// API
// ==========================================

export const subscriptionPlansApi = {
  /**
   * GET /subscription-plans — كل الخطط
   */
  getAll: async (page = 1, limit = 100) => {
    const response = await api.get(`/subscription-plans?page=${page}&limit=${limit}`);
    const result = response.data;

    // معالجة الـ responses المختلفة من الباك
    if (Array.isArray(result)) {
      return { data: result.map(toPlan), results: result.length };
    }
    if (Array.isArray(result?.data)) {
      return { ...result, data: result.data.map(toPlan) };
    }
    return result;
  },

  /**
   * GET /subscription-plans/:id — خطة واحدة
   */
  getById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await api.get(`/subscription-plans/${id}`);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },

  /**
   * POST /subscription-plans — إنشاء خطة جديدة
   */
  create: async (payload: CreateSubscriptionPlanPayload): Promise<SubscriptionPlan> => {
    const response = await api.post('/subscription-plans', payload);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },

  /**
   * PATCH /subscription-plans/:id — تحديث خطة
   */
  update: async (id: string, payload: UpdateSubscriptionPlanPayload): Promise<SubscriptionPlan> => {
    const response = await api.patch(`/subscription-plans/${id}`, payload);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },

  /**
   * DELETE /subscription-plans/:id — حذف خطة
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/subscription-plans/${id}`);
  },

  /**
   * PATCH /subscription-plans/:id/toggle-status — تفعيل / إيقاف خطة
   */
  toggleStatus: async (id: string): Promise<SubscriptionPlan> => {
    const response = await api.patch(`/subscription-plans/${id}/toggle-status`);
    const raw = response.data?.data ?? response.data;
    return toPlan(raw);
  },
};