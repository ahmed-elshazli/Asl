import api from '../../lib/api';

export interface Result {
  id: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultPayload {
  description: string;
  files: File[];
}

export interface UpdateResultPayload {
  description?: string;
  files?: File[];
  existingImages?: string[];
}

const toResult = (raw: any): Result => ({ ...raw, id: raw.id ?? raw._id });

export const resultsApi = {
  create: async (payload: CreateResultPayload): Promise<Result> => {
    const formData = new FormData();
    formData.append('description', payload.description);
    payload.files.forEach((file) => formData.append('images', file));

    const response = await api.post('/results', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return toResult(response.data?.data || response.data);
  },
  
  getAll: async (page = 1, limit = 10): Promise<{ results: number; data: Result[] }> => {
    // PUBLIC endpoint, you might want to use a non-auth axios instance if strictly required
    // But since the current api instance appends token if available, it works for both.
    const response = await api.get('/results', { params: { page, limit } });
    const data = response.data?.data || response.data;
    const resultsCount = response.data?.results || data?.length || 0;
    
    return {
      results: resultsCount,
      data: Array.isArray(data) ? data.map(toResult) : [],
    };
  },
  
  getById: async (id: string): Promise<Result> => {
    const response = await api.get(`/results/${id}`);
    return toResult(response.data?.data || response.data);
  },
  
  update: async (id: string, payload: UpdateResultPayload): Promise<Result> => {
    // Backend does not support updating images via PATCH, only description
    const response = await api.patch(`/results/${id}`, { description: payload.description });
    return toResult(response.data?.data || response.data);
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/results/${id}`);
  },
};
