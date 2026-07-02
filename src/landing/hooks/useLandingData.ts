import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'https://asl-api.up.railway.app/api/v1',
});

export const usePublishedReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'published'],
    queryFn: async () => {
      const response = await publicApi.get('/reviews/published');
      const raw = response.data;
      if (Array.isArray(raw)) return raw;
      if (raw?.data && Array.isArray(raw.data)) return raw.data;
      if (raw?.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
      if (raw?.data?.doc && Array.isArray(raw.data.doc)) return raw.data.doc;
      if (raw?.data?.docs && Array.isArray(raw.data.docs)) return raw.data.docs;
      if (raw?.data?.reviews && Array.isArray(raw.data.reviews)) return raw.data.reviews;
      return [];
    },
  });
};

export const useAboutUsPublic = () => {
  return useQuery({
    queryKey: ['about-us', 'public'],
    queryFn: async () => {
      try {
        const response = await publicApi.get('/about-us');
        const data = response.data?.data ?? response.data;
        if (Array.isArray(data) && data.length > 0) return data[0];
        return data || null;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });
};
