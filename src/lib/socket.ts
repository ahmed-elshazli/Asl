import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

// ==========================================
// إعداد الـ WebSocket (الطريقة الصحيحة)
// ==========================================

// رابط سيرفر الويب سوكت (غالباً بيكون نفس رابط الـ API بس من غير /api)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// متغير لحفظ حالة الاتصال عشان منعملش أكثر من اتصال في نفس الوقت
let socket: Socket | null = null;

/**
 * دالة لإنشاء الاتصال بالويب سوكت
 * 
 * الممارسات الصحيحة (Best Practices):
 * 1. بنبعت الـ Token في الـ auth (أو الـ query) عشان السيرفر يقدر يتأكد من هوية المستخدم.
 * 2. مش بنخلي الـ Socket يتصل تلقائياً مع تحميل الصفحة (autoConnect: false)،
 *    لأننا عايزينه يتصل بس لما المستخدم يعمل تسجيل دخول.
 */
export const connectSocket = () => {
  const token = useAuthStore.getState().token;

  // لو مفيش توكن (المستخدم مش مسجل دخول)، مفيش داعي نفتح الاتصال
  if (!token) return null;

  // لو الاتصال موجود أصلاً، هنرجعه زي ما هو (منعاً للتكرار)
  if (socket?.connected) return socket;

  // إنشاء الاتصال
  socket = io(SOCKET_URL, {
    autoConnect: true,
    // إرسال التوكن مع كل اتصال (عشان السيرفر يعرف مين اللي بيتصل)
    auth: {
      token: token
    },
    // اختياري: إرسال التوكن كـ query (لو السيرفر مش بيدعم الـ auth object)
    // query: { token },
  });

  // ==========================================
  // الاستماع للأحداث الأساسية للاتصال
  // ==========================================

  socket.on('connect', () => {
    console.log('✅ تم الاتصال بالويب سوكت بنجاح:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ تم قطع الاتصال بالويب سوكت:', reason);
    // لو السيرفر هو اللي قفل الاتصال، ممكن نحاول نرجعه هنا
  });

  socket.on('connect_error', (err) => {
    console.error('⚠️ خطأ في اتصال الويب سوكت:', err.message);
    // ده بيحصل غالباً لو التوكن غلط أو السيرفر مقفول
  });

  return socket;
};

/**
 * دالة لإنهاء الاتصال بالويب سوكت
 * 
 * الممارسات الصحيحة:
 * لازم نستخدم الدالة دي لما المستخدم يعمل Logout، عشان ميفضلش متصل ويسحب موارد من السيرفر.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('👋 تم إغلاق الويب سوكت عمداً');
  }
};

/**
 * دالة للحصول على الاتصال الحالي (عشان نستخدمه في أي component)
 */
export const getSocket = () => {
  return socket;
};
