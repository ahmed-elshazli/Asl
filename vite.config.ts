import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // هذا السطر هو السحر الذي سيشغل الـ PWA في وضع الـ npm run dev
      devOptions: {
        enabled: true
      },
      // الملفات دي لازم تكون موجودة في مجلد public
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'أصِل',
        short_name: 'Asl',
        description: 'منصة متكاملة لإدارة العيادة والمرضى والخطط الغذائية',
        theme_color: '#009E2A', // لون الـ Primary الخاص بالمشروع
        background_color: '#ffffff',
        display: 'standalone', // عشان يفتح كأبلكيشن منفصل بدون شريط المتصفح
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // مهم جداً عشان الأيقونة تظبط على أندرويد
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      // كل طلب يبدأ بـ /api هيتحول للسيرفر الحقيقي (يحل مشكلة CORS في التطوير)
      '/api': {
        target: 'https://asl-api.up.railway.app',
        changeOrigin: true,
        secure: true,
      }
    }
  },
})