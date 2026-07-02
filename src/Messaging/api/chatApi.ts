import api from '../../lib/api';

// ==========================================
// Types
// ==========================================

export interface Participant {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  images?: string[];
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  isGroup: boolean;
  unreadCount?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    content: string;
    sender: string;
    createdAt: string;
  };
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string | Participant; // السيرفر يرسلها باسم senderId
  content?: string;
  type?: string;
  fileUrl?: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationPayload {
  participants: string[];
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  file?: File;
}

// ==========================================
// API Calls
// ==========================================

export const chatApi = {
  // ─── Conversations ───

  /** جلب محادثات المستخدم الحالي */
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations/user-conversations');
    return response.data?.data ?? response.data;
  },

  /** البحث أو إنشاء محادثة جديدة */
  createConversation: async (payload: CreateConversationPayload): Promise<Conversation> => {
    const response = await api.post('/conversations', payload);
    return response.data?.data ?? response.data;
  },

  findOrCreateConversation: async (payload: CreateConversationPayload): Promise<Conversation> => {
    const response = await api.post('/conversations/find-or-create', payload);
    return response.data?.data ?? response.data;
  },

  getConversationById: async (id: string): Promise<Conversation> => {
    const response = await api.get(`/conversations/${id}`);
    return response.data?.data ?? response.data;
  },

  archiveConversation: async (id: string) => {
    // نرسل true للأرشفة
    const response = await api.patch(`/conversations/${id}/archive`, { archived: true });
    return response.data?.data ?? response.data;
  },

  unarchiveConversation: async (id: string) => {
    // بما أن مسار /unarchive غير موجود (404)، نحاول إرسال حالة false لمسار الأرشفة
    const response = await api.patch(`/conversations/${id}/archive`, { archived: false, isArchived: false, action: 'unarchive' });
    return response.data?.data ?? response.data;
  },

  leaveConversation: async (id: string) => {
    const response = await api.patch(`/conversations/${id}/leave`);
    return response.data?.data ?? response.data;
  },

  updateGroupName: async (id: string, groupName: string) => {
    const response = await api.patch(`/conversations/${id}/group-name`, { groupName });
    return response.data?.data ?? response.data;
  },

  addParticipant: async (id: string, participantId: string) => {
    const response = await api.patch(`/conversations/${id}/add-participant`, { participantId });
    return response.data?.data ?? response.data;
  },

  removeParticipant: async (id: string, participantId: string) => {
    const response = await api.patch(`/conversations/${id}/remove-participant`, { participantId });
    return response.data?.data ?? response.data;
  },

  markConversationAsRead: async (id: string) => {
    const response = await api.patch(`/conversations/${id}/read`);
    return response.data?.data ?? response.data;
  },

  // ─── Messages ───

  /** جلب رسائل محادثة معينة */
  getMessages: async (conversationId: string, page = 1, limit = 50): Promise<{ messages: Message[], totalPages: number }> => {
    const response = await api.get('/messages', {
      params: { conversationId, page, limit }
    });
    const data = response.data?.data ?? response.data;
    // التأكد من شكل البيانات العائدة وتنسيقها لتكون دائماً Object
    if (Array.isArray(data)) return { messages: data.reverse(), totalPages: 1 };
    
    // إذا كانت pagination object
    if (data.docs || data.messages) {
      const msgs = (data.docs || data.messages || []).reverse(); // نعكس الترتيب ليكون الأقدم أولاً في العرض
      return { messages: msgs, totalPages: data.totalPages || 1 };
    }
    
    return { messages: [], totalPages: 1 };
  },

  /** إرسال رسالة جديدة باستخدام FormData لدعم الملفات */
  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    const formData = new FormData();
    formData.append('conversationId', payload.conversationId);
    formData.append('content', payload.content);
    if (payload.file) {
      formData.append('file', payload.file);
    }

    const response = await api.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data ?? response.data;
  },

  // حذف رسالة
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};
