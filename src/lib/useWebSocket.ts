// src/lib/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url: string, onMessageReceived: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    // منع إنشاء اتصال جديد لو كان هناك اتصال قائم بالفعل
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('🟢 WebSocket Connected');
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageReceived(data);
    };

    ws.current.onclose = () => {
      console.log('🔴 WebSocket Disconnected. Trying to reconnect...');
      // محاولة إعادة الاتصال بعد 3 ثواني
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('⚠️ WebSocket Error:', error);
      ws.current?.close(); // إغلاق السوكت لإجبار onclose على العمل وإعادة الاتصال
    };
  }, [url, onMessageReceived]);

  useEffect(() => {
    connect();

    // 1. التعامل مع فتح التطبيق من الخلفية (OS Background/Foreground)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📱 App is in foreground, checking connection...');
        // إذا كان السوكت مغلقاً أو غير موجود، اتصل فوراً
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
          connect();
        }
      }
    };

    // 2. التعامل مع عودة الإنترنت (Network Restore)
    const handleOnline = () => {
      console.log('🌐 Internet restored, reconnecting...');
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        connect();
      }
    };

    // تسجيل المستشعرات
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    // تنظيف المستشعرات والاتصالات عند تدمير المكون (Cleanup)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  const sendMessage = (payload: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    } else {
      console.warn('⚠️ Cannot send message, WebSocket is not open.');
    }
  };

  return { sendMessage };
};