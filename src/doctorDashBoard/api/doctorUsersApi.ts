import api from '../../lib/api';

// ==========================================
// Types
// ==========================================
export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  isActive: boolean;
  gender: string;
  age: number;
  height: number;
  weight: number;
  createdAt: string;
  country: string;
  images: string[];
}

export interface UsersResponse {
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: ApiUser[];
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  country: string;
  role?: 'patient' | 'doctor' | 'admin';
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  country?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

// ==========================================
// Helper — يضمن id موجود سواء الباك بعت id أو _id
// ==========================================
const toUser = (raw: any): ApiUser => ({
  ...raw,
  id: raw.id ?? raw._id,
});

// ==========================================
// API
// ==========================================
export const doctorUsersApi = {
  /** GET /users */
  getAll: async (page = 1, limit = 10, search = ''): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.append('keyword', search);
    
    const response = await api.get(`/users?${queryParams.toString()}`);
    const result = response.data;
    return {
      ...result,
      data: (result.data ?? []).map(toUser),
    };
  },

  /** GET /users/{id} */
  getById: async (id: string): Promise<ApiUser> => {
    const response = await api.get(`/users/${id}`);
    const raw = response.data?.data ?? response.data;
    return toUser(raw);
  },

  /** POST /users/create */
  create: async (payload: CreateUserPayload): Promise<ApiUser> => {
    const response = await api.post('/users/create', payload);
    const raw = response.data?.data ?? response.data;
    return toUser(raw);
  },

  /** PATCH /users/{id} */
  updateById: async (id: string, payload: UpdateUserPayload): Promise<ApiUser> => {
    const response = await api.patch(`/users/${id}`, payload);
    const raw = response.data?.data ?? response.data;
    return toUser(raw);
  },

  /** PATCH /users/change-password */
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await api.patch('/users/change-password', payload);
  },

  /** PATCH /users/{id}/activations */
  toggleActivation: async (id: string): Promise<ApiUser> => {
    const response = await api.patch(`/users/${id}/activations`);
    const raw = response.data?.data ?? response.data;
    return toUser(raw);
  },

  /** DELETE /users/{id}/delete */
  deleteById: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}/delete`);
  },
};