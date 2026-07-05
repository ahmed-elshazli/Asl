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
  senderId: string | Participant;
  content?: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  isRead?: boolean;
  isDeleted?: boolean;
  isOptimistic?: boolean; // علامة للرسائل الوهمية (Optimistic UI)
  createdAt: string;
  updatedAt?: string;
}

export interface CreateConversationPayload {
  participants: string[];
}

export interface SendMessagePayload {
  conversationId: string;
  content?: string;
  file?: File;
}

export interface UploadFileResponse {
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
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
    
    // الباك إند يرسل البيانات في: response.data.data
    // والـ Pagination في: response.data.pagination
    const rawResponse = response.data;
    
    let messagesArray = [];
    let totalPages = 1;

    if (rawResponse?.data && Array.isArray(rawResponse.data)) {
      messagesArray = [...rawResponse.data].reverse();
    } else if (Array.isArray(rawResponse)) {
      messagesArray = [...rawResponse].reverse();
    } else if (rawResponse?.messages && Array.isArray(rawResponse.messages)) {
      messagesArray = [...rawResponse.messages].reverse();
    }

    if (rawResponse?.pagination?.numberOfPages) {
      totalPages = rawResponse.pagination.numberOfPages;
    } else if (rawResponse?.totalPages) {
      totalPages = rawResponse.totalPages;
    }

    return { messages: messagesArray, totalPages };
  },

  /** رفع ملف — POST /messages/upload */
  uploadFile: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/messages/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  },

  /** إرسال رسالة عبر REST (fallback فقط — الـ Flow الأساسي يستخدم Socket) */
  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    const formData = new FormData();
    formData.append('conversationId', payload.conversationId);
    if (payload.content) formData.append('content', payload.content);
    if (payload.file) formData.append('file', payload.file);
    const response = await api.post('/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  },

  // حذف رسالة
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};
