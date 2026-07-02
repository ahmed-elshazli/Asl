import api from '../../lib/api';

// ==========================================
// Types
// ==========================================
export interface SubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  billingCycle?: string;
  durationInMonths?: number;
  durationInDays?: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface SubscriptionPlansResponse {
  results?: number;
  pagination?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: SubscriptionPlan[];
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  billingCycle?: string;
  durationInMonths?: number;
  durationInDays?: number;
  features: string[];
  isPopular?: boolean;
  sortOrder?: number;
}

export type UpdateSubscriptionPlanPayload = Partial<CreateSubscriptionPlanPayload>;

// ==========================================
// API
// ==========================================
export const subscriptionPlansApi = {
  /** POST /api/v1/subscription-plans — Create a new subscription plan */
  create: async (payload: CreateSubscriptionPlanPayload): Promise<SubscriptionPlan> => {
    const response = await api.post('/subscription-plans', payload);
    return response.data?.data ?? response.data;
  },

  /** GET /api/v1/subscription-plans — Get all subscription plans */
  getAll: async (page = 1, limit = 100): Promise<SubscriptionPlansResponse> => {
    const response = await api.get(`/subscription-plans?page=${page}&limit=${limit}`);
    return response.data;
  },

  /** GET /api/v1/subscription-plans/{id} — Get a subscription plan by ID */
  getById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await api.get(`/subscription-plans/${id}`);
    return response.data?.data ?? response.data;
  },

  /** PATCH /api/v1/subscription-plans/{id} — Update a subscription plan */
  update: async (id: string, payload: UpdateSubscriptionPlanPayload): Promise<SubscriptionPlan> => {
    const response = await api.patch(`/subscription-plans/${id}`, payload);
    return response.data?.data ?? response.data;
  },

  /** DELETE /api/v1/subscription-plans/{id} — Delete a subscription plan */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/subscription-plans/${id}`);
  },

  /** PATCH /api/v1/subscription-plans/{id}/toggle-status — Toggle active/inactive status */
  toggleStatus: async (id: string): Promise<SubscriptionPlan> => {
    const response = await api.patch(`/subscription-plans/${id}/toggle-status`);
    return response.data?.data ?? response.data;
  },
};
