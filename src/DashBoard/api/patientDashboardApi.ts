import api from '../../lib/api';

export interface DashboardCaloriesData {
  day: string;
  calories: number;
}

export interface DashboardMacrosData {
  name: string;
  value: number;
  color?: string;
}

export interface DashboardData {
  dailyCalories?: number;
  dailyCaloriesTarget?: number;
  remainingMeals?: number;
  totalMeals?: number;
  currentWeight?: number;
  weightChange?: number;
  achievementsCount?: number;
  latestAchievement?: string;
  caloriesData?: DashboardCaloriesData[];
  macrosData?: DashboardMacrosData[];
  // Fallback for whatever structure the backend actually sends
  [key: string]: any;
}

export const patientDashboardApi = {
  /** GET /patient-dashboard/me — جلب إحصائيات المريض الحالي */
  getMyDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/patient-dashboard/me');
    return response.data?.data ?? response.data;
  },

  /** GET /patient-dashboard/{userId} — جلب إحصائيات مريض معين (للطبيب) */
  getPatientDashboard: async (userId: string): Promise<DashboardData> => {
    const response = await api.get(`/patient-dashboard/${userId}`);
    return response.data?.data ?? response.data;
  },

  /** GET /patient-dashboard/weight-history — جلب تاريخ وزن المريض الحالي */
  getWeightHistory: async (): Promise<any[]> => {
    const response = await api.get('/patient-dashboard/weight-history');
    return response.data?.data ?? response.data;
  },
};
