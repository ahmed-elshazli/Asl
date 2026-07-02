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
    const raw = response.data;
    if (Array.isArray(raw)) return raw;
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    if (raw?.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
    if (raw?.data?.doc && Array.isArray(raw.data.doc)) return raw.data.doc;
    if (raw?.data?.docs && Array.isArray(raw.data.docs)) return raw.data.docs;
    if (raw?.data?.reviews && Array.isArray(raw.data.reviews)) return raw.data.reviews;
    return [];
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
