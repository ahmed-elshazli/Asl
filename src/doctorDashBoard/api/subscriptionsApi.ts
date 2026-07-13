import api from '../../lib/api';

// ==========================================
// Types
// ==========================================

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface SubscriptionUser {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
}

export interface SubscriptionPlanRef {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
}

export interface SubscriptionPaymentMethodRef {
  _id: string;
  name: string;
  type?: string;
  accountName?: string;
  accountNumber?: string;
  instructions?: string;
}

export interface Subscription {
  _id: string;
  user: SubscriptionUser;
  plan: SubscriptionPlanRef;
  paymentMethod?: SubscriptionPaymentMethodRef;
  senderNumber?: string;
  paymentScreenshot?: string;
  startDate?: string;
  endDate?: string;
  status: SubscriptionStatus;
  approvedBy?: { _id: string; fullName: string; role: string };
  reviewedAt?: string;
  rejectReason?: string;
  createdAt: string;
}

export interface CreateSubscriptionByPatientPayload {
  planId: string;
  paymentMethodId: string;
  senderNumber: string;
  paymentScreenshot: File;
}

export interface CreateSubscriptionByDoctorPayload {
  userId: string;
  planId: string;
}

export interface RejectSubscriptionPayload {
  subscriptionId: string;
  rejectReason: string;
}

export interface SubscriptionsResponse {
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: Subscription[];
}

// ==========================================
// API calls
// ==========================================

export const subscriptionsApi = {
  /** Patient creates a subscription request (PENDING) - multipart/form-data */
  createByPatient: async (payload: CreateSubscriptionByPatientPayload): Promise<Subscription> => {
    const formData = new FormData();
    formData.append('planId', payload.planId);
    formData.append('paymentMethodId', payload.paymentMethodId);
    formData.append('senderNumber', payload.senderNumber);
    formData.append('paymentScreenshot', payload.paymentScreenshot);
    const response = await api.post('/subscriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },

  /** Doctor creates an ACTIVE subscription directly for a user */
  createByDoctor: async (payload: CreateSubscriptionByDoctorPayload): Promise<Subscription> => {
    const response = await api.post('/subscriptions/create-by-doctor', payload);
    return response.data?.data || response.data;
  },

  /** Get all subscriptions (doctor/admin only) */
  getAll: async (page = 1, limit = 100): Promise<SubscriptionsResponse> => {
    const response = await api.get('/subscriptions', { params: { page, limit, sort: '-createdAt' } });
    return response.data;
  },

  /** Get pending subscription requests (doctor/admin only) */
  getPending: async (page = 1, limit = 100): Promise<SubscriptionsResponse> => {
    const response = await api.get('/subscriptions/pending', { params: { page, limit, sort: '-createdAt' } });
    return response.data;
  },

  /** Get current user's subscription */
  getMyCurrent: async (): Promise<Subscription | null> => {
    try {
      const response = await api.get('/subscriptions/me');
      return response.data?.data || response.data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  /** Approve a pending subscription */
  approve: async (id: string): Promise<Subscription> => {
    const response = await api.patch(`/subscriptions/approve/${id}`);
    return response.data?.data || response.data;
  },

  /** Reject a pending subscription */
  reject: async (payload: RejectSubscriptionPayload): Promise<Subscription> => {
    const response = await api.patch('/subscriptions/reject', payload);
    return response.data?.data || response.data;
  },

  /** Cancel a subscription */
  cancel: async (id: string): Promise<Subscription> => {
    const response = await api.patch(`/subscriptions/${id}/cancel`);
    return response.data?.data || response.data;
  },

  /** Patient cancels their own active subscription */
  cancelMine: async (): Promise<Subscription> => {
    const response = await api.patch('/subscriptions/me/cancel');
    return response.data?.data || response.data;
  },
};
