import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ==========================================
// 1. إعداد الـ Base URL
// ==========================================
const BASE_URL = 'https://asl-api.up.railway.app/api/v1';

// إنشاء نسخة من axios بإعدادات افتراضية
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 2. إعداد الـ Interceptors (الاعتراضات)
// ==========================================

// Request Interceptor: قبل ما أي طلب يتبعت للباك إند
api.interceptors.request.use(
  (config) => {
    // هنجيب التوكن من الـ Auth Store بتاعنا
    const token = useAuthStore.getState().token;
    
    // لو فيه توكن، هنضيفه للـ Headers عشان الباك إند يعرف مين اللي باعت الطلب
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: لما الرد يرجع من الباك إند
api.interceptors.response.use(
  (response) => {
    // لو الرد سليم (200 OK)، هنرجعه زي ما هو
    return response;
  },
  (error) => {
    // لو الرد فيه خطأ (مثلاً 401 Unauthorized - يعني التوكن انتهى أو غير صالح)
    if (error.response && error.response.status === 401) {
      // هنعمل تسجيل خروج للمستخدم عشان يدخل من أول وجديد
      useAuthStore.getState().logout();
      
      // هنشيل التحويل الإجباري للصفحة الرئيسية لأنه بيعمل مشكلة Refresh لا نهائي
      // لو محتاجين نحوله، يفضل يتم التعامل معاها من خلال React Router في الـ UI
    }
    
    return Promise.reject(error);
  }
);

// تصدير الـ api عشان نستخدمه في أي مكان في المشروع
export default api;
