import api from '../../lib/api';

export interface PatientReview {
  _id?: string;
  id?: string;
  rating: number;
  comment: string;
  isPublished?: boolean;
  createdAt?: string;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
}

export const patientReviewsApi = {
  getMyReview: async (): Promise<PatientReview | null> => {
    try {
      const response = await api.get('/reviews/me');
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data[0] : (data || null);
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        return null; // Handle if no review exists
      }
      throw error;
    }
  },
  
  createReview: async (data: CreateReviewDto): Promise<PatientReview> => {
    const response = await api.post('/reviews', data);
    return response.data?.data ?? response.data;
  },

  updateReview: async (data: CreateReviewDto): Promise<PatientReview> => {
    const response = await api.patch('/reviews/update', data);
    return response.data?.data ?? response.data;
  },

  deleteMyReview: async (): Promise<void> => {
    await api.delete('/reviews/me');
  }
};
