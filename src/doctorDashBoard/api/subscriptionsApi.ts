import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore'; 


// ==========================================
// Types
// ==========================================

export interface Subscription {
  _id: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  plan?: {
    _id: string;
    name: string;
    price: number;
    durationInDays: number;
  };
  paymentMethod?: {
    _id: string;
    name: string;
    type: string;
    accountName: string;
    accountNumber: string;
    instructions?: string;
  };
  senderNumber?: string;
  paymentScreenshot?: string;
  startDate?: string;
  endDate?: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  approvedBy?: { _id: string; fullName: string; role: string } | null;
  reviewedAt?: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt?: string;
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

// ==========================================
// API
// ==========================================

export const subscriptionsApi = {
  /**
   * POST /subscriptions — المريض يطلب اشتراك مع إيصال دفع
   * multipart/form-data مطلوب
   */
  createByPatient: async (payload: CreateSubscriptionByPatientPayload) => {
    const formData = new FormData();
    formData.append('planId', payload.planId);
    formData.append('paymentMethodId', payload.paymentMethodId);
    formData.append('senderNumber', payload.senderNumber);
    formData.append('paymentScreenshot', payload.paymentScreenshot);

    const response = await api.post('/subscriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * POST /subscriptions/create-by-doctor — الدكتور ينشئ اشتراك نشط مباشرة
   */
  createByDoctor: async (payload: CreateSubscriptionByDoctorPayload) => {
    const response = await api.post('/subscriptions/create-by-doctor', payload);
    return response.data;
  },

  /**
   * GET /subscriptions — كل الاشتراكات (admin/doctor)
   */
  getAll: async (page = 1, limit = 100): Promise<SubscriptionsResponse> => {
    const response = await api.get(`/subscriptions?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * GET /subscriptions/pending — الاشتراكات المعلقة
   */
  getPending: async (page = 1, limit = 100): Promise<SubscriptionsResponse> => {
    const response = await api.get(`/subscriptions/pending?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * GET /subscriptions/me — اشتراك المريض الحالي
   * ⚠️ الباك بيرجع array من .find() — بنأخذ أول عنصر (الأحدث)
   */
 
 
getMyCurrent: async (): Promise<Subscription | null> => {
  try {
    const token   = useAuthStore.getState().token;
    const baseURL = api.defaults.baseURL || 'https://asl-api.up.railway.app/api/v1';
 
    // ✅ fetch مع cache: 'no-store' بيكسر الـ browser HTTP cache
    // بدون ما يبعت Cache-Control header (فمفيش CORS issue)
    const res = await fetch(`${baseURL}/subscriptions/me`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    });
 
    if (!res.ok) return null;
 
    const data = await res.json();
 
    let subs: Subscription[] = [];
    if (Array.isArray(data))             subs = data;
    else if (Array.isArray(data?.data))  subs = data.data;
    else if (data?._id)                  subs = [data as Subscription];
    else                                 return null;
 
    if (subs.length === 0) return null;
 
    // أولوية: ACTIVE → PENDING → الأحدث
    return (
      subs.find((s) => s.status === 'ACTIVE')  ||
      subs.find((s) => s.status === 'PENDING') ||
      subs[0]
    );
  } catch {
    return null;
  }
},
 

  /**
   * PATCH /subscriptions/approve/:id — الدكتور يوافق على اشتراك
   */
  approve: async (id: string) => {
    const response = await api.patch(`/subscriptions/approve/${id}`);
    return response.data;
  },

  /**
   * PATCH /subscriptions/reject — الدكتور يرفض اشتراك مع سبب
   */
  reject: async (payload: RejectSubscriptionPayload) => {
    const response = await api.patch('/subscriptions/reject', payload);
    return response.data;
  },

  /**
   * PATCH /subscriptions/:id/cancel — إلغاء اشتراك محدد (admin/doctor)
   */
  cancel: async (id: string) => {
    const response = await api.patch(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  /**
   * PATCH /subscriptions/me/cancel — المريض يلغي اشتراكه
   */
  cancelMine: async () => {
    const response = await api.patch('/subscriptions/me/cancel');
    return response.data;
  },
};