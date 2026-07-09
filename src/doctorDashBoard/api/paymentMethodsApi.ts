import api from '../../lib/api';

export const PaymentMethodType = {
  BANK_TRANSFER: 'bank_transfer',
  INSTAPAY: 'instapay',
  VODAFONE_CASH: 'vodafone_cash',
  ORANGE_CASH: 'orange_cash',
  ETISALAT_CASH: 'etisalat_cash',
  WE_PAY: 'we_pay',
  OTHER: 'other',
} as const;

export type PaymentMethodType = typeof PaymentMethodType[keyof typeof PaymentMethodType];

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  accountName: string;
  accountNumber: string;
  qrCode?: string;
  instructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodPayload {
  name: string;
  type: PaymentMethodType;
  accountName: string;
  accountNumber: string;
  qrCode?: string;
  instructions?: string;
}

export type UpdatePaymentMethodPayload = Partial<CreatePaymentMethodPayload>;

const toPaymentMethod = (raw: any): PaymentMethod => ({ ...raw, id: raw.id ?? raw._id });

export const paymentMethodsApi = {
  create: async (payload: CreatePaymentMethodPayload): Promise<PaymentMethod> => {
    const response = await api.post('/payment-methods', payload);
    return toPaymentMethod(response.data?.data || response.data);
  },
  
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/payment-methods');
    const data = response.data?.data || response.data || [];
    return data.map(toPaymentMethod);
  },
  
  getAllAdmin: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/payment-methods/admin');
    const data = response.data?.data || response.data || [];
    return data.map(toPaymentMethod);
  },
  
  getById: async (id: string): Promise<PaymentMethod> => {
    const response = await api.get(`/payment-methods/${id}`);
    return toPaymentMethod(response.data?.data || response.data);
  },
  
  update: async (id: string, payload: UpdatePaymentMethodPayload): Promise<PaymentMethod> => {
    const response = await api.patch(`/payment-methods/${id}`, payload);
    return toPaymentMethod(response.data?.data || response.data);
  },
  
  toggleStatus: async (id: string): Promise<PaymentMethod> => {
    const response = await api.patch(`/payment-methods/${id}/toggle-status`);
    return toPaymentMethod(response.data?.data || response.data);
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/payment-methods/${id}`);
  },
};
