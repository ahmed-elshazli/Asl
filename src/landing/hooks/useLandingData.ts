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
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : (data?.data ?? []);
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
