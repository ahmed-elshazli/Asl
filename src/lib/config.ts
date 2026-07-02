// src/lib/config.ts

// نستخدم import.meta.env في Vite للوصول لمتغيرات البيئة
export const API_BASE_URL = import.meta.env.VITE_API_URL ;

// إذا لم يكن لديك رابط منفصل للسوكت، عادة ما يتم استنتاجه من رابط الـ API
export const WS_BASE_URL = import.meta.env.VITE_WS_URL ;