import api from '../../lib/api';

export interface Review {
  _id?: string;
  id?: string;
  rating: number;
  comment: string;
  isPublished?: boolean;
  user?: {
    _id: string;
    fullName: string;
    images?: string[];
  };
  createdAt?: string;
}

export interface ReviewStatistics {
  totalReviews?: number;
  averageRating?: number;
  [key: string]: any;
}

export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    const response = await api.get('/reviews');
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : (data?.data ?? []);
  },
  togglePublish: async (id: string): Promise<Review> => {
    const response = await api.patch(`/reviews/${id}/toggle-publish`);
    return response.data?.data ?? response.data;
  },
  delete: async (id: string): Promise<void> => {
    // If admin can delete, it might be /reviews/{id} or /reviews/admin/{id}
    await api.delete(`/reviews/${id}`);
  },
  getStatistics: async (): Promise<ReviewStatistics> => {
    const response = await api.get('/reviews/statistics');
    return response.data?.data ?? response.data;
  }
};
