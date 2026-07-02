import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../store/authStore';
import type { Message } from './chatApi';

const SOCKET_URL = 'https://asl-api.up.railway.app';

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: Set<(message: Message) => void> = new Set();

  connect() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // الاستماع للرسائل الجديدة
    this.socket.on('newMessage', (message: Message) => {
      this.messageListeners.forEach((listener) => listener(message));
    });

    // استماع للأخطاء
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // إضافة مستمع للرسائل الجديدة
  onNewMessage(callback: (message: Message) => void) {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  // الانضمام لغرفة (محادثة) - إذا كان الباك إند يعتمد على Rooms
  joinConversation(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join', conversationId);
    }
  }

  // مغادرة غرفة
  leaveConversation(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave', conversationId);
    }
  }
}

export const socketService = new SocketService();
