import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../store/authStore';
import type { Message } from './chatApi';

const SOCKET_URL = 'https://asl-api.up.railway.app';

// ─── Payload Types ────────────────────────────────────────────────────────────
export interface SendMessagePayload {
  conversationId: string;
  content?: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface TypingPayload {
  conversationId: string;
  userId: string;
}

export interface MessageSeenPayload {
  messageId: string;
  userId: string;
}

// ─── Listener Types ───────────────────────────────────────────────────────────
type MessageListener = (message: Message) => void;
type DeleteListener = (data: { messageId: string; conversationId?: string }) => void;
type TypingListener = (data: TypingPayload) => void;
type OnlineUsersListener = (users: string[]) => void;
type MessageSeenListener = (data: MessageSeenPayload) => void;

// ─── Socket Service ───────────────────────────────────────────────────────────
class SocketService {
  private socket: Socket | null = null;
  private recoveryListenersAttached = false;
  private activeConversationId: string | null = null;

  // Listener Sets
  private messageListeners: Set<MessageListener> = new Set();
  private deleteListeners: Set<DeleteListener> = new Set();
  private typingListeners: Set<TypingListener> = new Set();
  private stopTypingListeners: Set<TypingListener> = new Set();
  private onlineUsersListeners: Set<OnlineUsersListener> = new Set();
  private messageSeenListeners: Set<MessageSeenListener> = new Set();

  // ─── Connect ────────────────────────────────────────────────────────────────
  connect() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    // تنظيف أي Socket قديم عالق في حالة CONNECTING
    this.cleanup();

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    // ─── Connection Events ──────────────────────────────────────────────────
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      // إعادة الانضمام للغرفة النشطة عند إعادة الاتصال
      if (this.activeConversationId) {
        console.log(`✅ Rejoining room on connect: ${this.activeConversationId}`);
        this.socket?.emit('joinConversation', this.activeConversationId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connect_error:', err.message);
    });

    // ─── Catch-All (Debugging — سيتم إزالته لاحقاً) ─────────────────────────
    this.socket.onAny((eventName, ...args) => {
      console.log(`🟢 [WS] Event: "${eventName}"`, args);
    });

    // ─── Message Events ─────────────────────────────────────────────────────
    this.socket.on('newMessage', (message: Message) => {
      console.log('📩 [WS] newMessage received:', message._id);
      this.messageListeners.forEach((listener) => listener(message));
    });

    this.socket.on('messageDeleted', (payload: any) => {
      let messageId = '';
      let conversationId: string | undefined;
      if (typeof payload === 'string') {
        messageId = payload;
      } else if (payload && typeof payload === 'object') {
        messageId = payload.messageId || payload._id || payload.id;
        conversationId = payload.conversationId || payload.conversation;
      }
      if (messageId) {
        this.deleteListeners.forEach((listener) =>
          listener({
            messageId: String(messageId),
            conversationId: conversationId ? String(conversationId) : undefined,
          })
        );
      }
    });

    // ─── Typing Events ──────────────────────────────────────────────────────
    this.socket.on('typing', (data: TypingPayload) => {
      this.typingListeners.forEach((listener) => listener(data));
    });

    this.socket.on('stopTyping', (data: TypingPayload) => {
      this.stopTypingListeners.forEach((listener) => listener(data));
    });

    // ─── Online Users ───────────────────────────────────────────────────────
    this.socket.on('onlineUsers', (data: { users: string[] } | any) => {
      const users = Array.isArray(data) ? data : data?.users || [];
      this.onlineUsersListeners.forEach((listener) => listener(users));
    });

    // ─── Message Seen ───────────────────────────────────────────────────────
    this.socket.on('messageSeen', (data: MessageSeenPayload) => {
      this.messageSeenListeners.forEach((listener) => listener(data));
    });

    // ─── Room Confirmations ─────────────────────────────────────────────────
    this.socket.on('joinedConversation', (data: any) => {
      const convId = data?.conversationId || this.activeConversationId || 'unknown';
      console.log(`✅ Confirmed joined room: ${convId}`);
    });

    this.socket.on('leftConversation', (data: any) => {
      const convId = data?.conversationId || 'unknown';
      console.log(`✅ Confirmed left room: ${convId}`);
    });

    // ─── Error ──────────────────────────────────────────────────────────────
    this.socket.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
    });

    // ─── Recovery ───────────────────────────────────────────────────────────
    if (!this.recoveryListenersAttached) {
      this.recoveryListenersAttached = true;
      this.attachRecoveryListeners();
    }
  }

  // ─── Emit: Send Message ─────────────────────────────────────────────────────
  sendMessage(payload: SendMessagePayload): void {
    if (!this.socket?.connected) {
      console.error('❌ Cannot send message: Socket not connected');
      return;
    }
    this.socket.emit('sendMessage', payload);
  }

  // ─── Emit: Typing ───────────────────────────────────────────────────────────
  emitTyping(conversationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', conversationId);
    }
  }

  emitStopTyping(conversationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('stopTyping', conversationId);
    }
  }

  // ─── Emit: Message Seen ─────────────────────────────────────────────────────
  emitMessageSeen(conversationId: string, messageId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('messageSeen', { conversationId, messageId });
    }
  }

  // ─── Rooms ──────────────────────────────────────────────────────────────────
  joinConversation(conversationId: string) {
    this.activeConversationId = conversationId;
    if (this.socket?.connected) {
      console.log(`📌 Emitting joinConversation: ${conversationId}`);
      this.socket.emit('joinConversation', conversationId);
    }
  }

  leaveConversation(conversationId: string) {
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = null;
    }
    if (this.socket?.connected) {
      console.log(`📌 Emitting leaveConversation: ${conversationId}`);
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  // ─── Recovery Listeners ─────────────────────────────────────────────────────
  private attachRecoveryListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.ensureConnection();
      }
    });
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        this.forceReconnect();
      }
    });
    window.addEventListener('online', () => {
      this.ensureConnection();
    });
  }

  private ensureConnection() {
    if (!useAuthStore.getState().token) return;
    if (!this.socket) { this.connect(); return; }
    if (this.socket.connected) return;
    if (!this.socket.connected && !this.socket.disconnected) { this.forceReconnect(); return; }
    if (this.socket.disconnected) { this.socket.connect(); }
  }

  private forceReconnect() {
    this.cleanup();
    this.connect();
  }

  // ─── Cleanup ────────────────────────────────────────────────────────────────
  private cleanup() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  disconnect() {
    this.cleanup();
  }

  // ─── Subscribe Methods ──────────────────────────────────────────────────────
  onNewMessage(callback: MessageListener) {
    this.messageListeners.add(callback);
    return () => { this.messageListeners.delete(callback); };
  }

  onMessageDeleted(callback: DeleteListener) {
    this.deleteListeners.add(callback);
    return () => { this.deleteListeners.delete(callback); };
  }

  onTyping(callback: TypingListener) {
    this.typingListeners.add(callback);
    return () => { this.typingListeners.delete(callback); };
  }

  onStopTyping(callback: TypingListener) {
    this.stopTypingListeners.add(callback);
    return () => { this.stopTypingListeners.delete(callback); };
  }

  onOnlineUsers(callback: OnlineUsersListener) {
    this.onlineUsersListeners.add(callback);
    return () => { this.onlineUsersListeners.delete(callback); };
  }

  onMessageSeen(callback: MessageSeenListener) {
    this.messageSeenListeners.add(callback);
    return () => { this.messageSeenListeners.delete(callback); };
  }

  // ─── Getter ─────────────────────────────────────────────────────────────────
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
