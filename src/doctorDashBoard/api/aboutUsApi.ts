import api from '../../lib/api';

export interface AboutUs {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  email: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  founderImage?: any; // URL or File
  certificationImages?: any[]; // URLs or Files
  [key: string]: any;
}

export const aboutUsApi = {
  get: async (): Promise<AboutUs | null> => {
    try {
      const response = await api.get('/about-us');
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data) && data.length > 0) return data[0];
      return data || null;
    } catch (e) {
      return null;
    }
  },
  create: async (payload: Partial<AboutUs>): Promise<AboutUs> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'certificationImages' && Array.isArray(value)) {
          value.forEach(file => formData.append('certificationImages', file));
        } else {
          formData.append(key, value as any);
        }
      }
    });
    const response = await api.post('/about-us', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  },
  update: async (payload: Partial<AboutUs>): Promise<AboutUs> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'certificationImages' && Array.isArray(value)) {
          value.forEach(file => formData.append('certificationImages', file));
        } else {
          formData.append(key, value as any);
        }
      }
    });
    const response = await api.patch('/about-us', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  }
};
