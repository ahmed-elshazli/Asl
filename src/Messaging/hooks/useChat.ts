import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import type { CreateConversationPayload, SendMessagePayload, Message } from '../api/chatApi';
import { socketService } from '../api/socketService';
import { useAuthStore } from '../../store/authStore';

// ─── Conversations ───────────────────────────────────────────────────────────

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: chatApi.getConversations,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateConversationPayload) => chatApi.createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useFindOrCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateConversationPayload) => chatApi.findOrCreateConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useConversation = (id: string | null) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => chatApi.getConversationById(id!),
    enabled: !!id,
  });
};

export const useArchiveConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.archiveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useUnarchiveConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.unarchiveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useLeaveConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.leaveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useUpdateGroupName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      chatApi.updateGroupName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useAddParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, participantId }: { id: string; participantId: string }) =>
      chatApi.addParticipant(id, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, participantId }: { id: string; participantId: string }) =>
      chatApi.removeParticipant(id, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.markConversationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// ─── Messages (Socket-First Architecture) ─────────────────────────────────────

/**
 * هذا الهوك يدير:
 * 1. جلب الرسائل من الـ API (useQuery)
 * 2. الاتصال بالـ Socket والانضمام للغرفة
 * 3. الاستماع للرسائل الجديدة وتحديث الكاش فوراً (0ms)
 * 4. Deduplication ذكي: منع التكرار + استبدال الرسائل الوهمية بالحقيقية
 * 5. Soft Delete عبر Socket
 */
export const useConversationMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  // Ref لمنع Stale Closure بدون إعادة تسجيل المستمعين
  const activeConvIdRef = useRef(conversationId);
  useEffect(() => {
    activeConvIdRef.current = conversationId;
  }, [conversationId]);

  // Ref لحفظ ID المستخدم الحالي
  const myIdRef = useRef(user?.id || (user as any)?._id || '');
  useEffect(() => {
    myIdRef.current = user?.id || (user as any)?._id || '';
  }, [user]);

  // ─── Socket Connection + Event Listeners ──────────────────────────────────
  useEffect(() => {
    socketService.connect();

    // ─── استقبال رسالة جديدة ────────────────────────────────────────────────
    const unsubMessage = socketService.onNewMessage((newMessage) => {
      const msgConvId = String(newMessage.conversationId || '');
      const targetKey = msgConvId || String(activeConvIdRef.current);

      if (!targetKey || targetKey === 'null' || targetKey === 'undefined') return;

      const exactKey = ['messages', targetKey];

      queryClient.setQueryData(exactKey, (oldData: any) => {
        if (!oldData) return undefined; // لا ننشئ Ghost Caches

        const currentMessages: Message[] = Array.isArray(oldData)
          ? oldData
          : oldData.messages || [];

        // ─── Deduplication ─────────────────────────────────────────────────
        // 1. هل الرسالة موجودة بالفعل بنفس الـ _id؟
        if (currentMessages.some((msg) => String(msg._id) === String(newMessage._id))) {
          return oldData; // تجاهل التكرار
        }

        // 2. هل هذه الرسالة هي Echo للرسالة الوهمية التي أرسلناها (Optimistic)؟
        //    نتحقق: هل يوجد msg.isOptimistic بنفس الـ content و senderId؟
        const senderIdStr =
          typeof newMessage.senderId === 'object' && newMessage.senderId !== null
            ? (newMessage.senderId as any)._id || (newMessage.senderId as any).id
            : newMessage.senderId;

        const optimisticIndex = currentMessages.findIndex(
          (msg) =>
            msg.isOptimistic &&
            String(msg._id).startsWith('temp-') &&
            String(senderIdStr) === String(myIdRef.current)
        );

        let updatedMessages: Message[];
        if (optimisticIndex !== -1) {
          // استبدال الرسالة الوهمية بالحقيقية (Seamless Swap)
          updatedMessages = currentMessages.map((msg, i) =>
            i === optimisticIndex ? { ...newMessage, isOptimistic: false } : msg
          );
        } else {
          // إضافة رسالة جديدة (من مستخدم آخر)
          updatedMessages = [...currentMessages, newMessage];
        }

        return Array.isArray(oldData)
          ? updatedMessages
          : { ...oldData, messages: updatedMessages };
      });

      // تحديث القائمة الجانبية (آخر رسالة)
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    // ─── حذف رسالة (Soft Delete) ────────────────────────────────────────────
    const unsubDelete = socketService.onMessageDeleted(
      ({ messageId, conversationId: payloadConvId }) => {
        const targetKey = String(
          payloadConvId && payloadConvId !== 'undefined'
            ? payloadConvId
            : activeConvIdRef.current
        );
        if (!targetKey || targetKey === 'null' || targetKey === 'undefined') return;

        queryClient.setQueryData(['messages', targetKey], (oldData: any) => {
          if (!oldData) return undefined;

          const currentMessages: Message[] = Array.isArray(oldData)
            ? oldData
            : oldData.messages || [];

          const updatedMessages = currentMessages.map((msg) =>
            String(msg._id) === String(messageId)
              ? {
                  ...msg,
                  isDeleted: true,
                  content: '🚫 تم حذف هذه الرسالة',
                  fileUrl: undefined,
                }
              : msg
          );

          return Array.isArray(oldData)
            ? updatedMessages
            : { ...oldData, messages: updatedMessages };
        });
      }
    );

    return () => {
      unsubMessage();
      unsubDelete();
    };
  }, [queryClient]);

  // ─── Room Join/Leave ────────────────────────────────────────────────────────
  useEffect(() => {
    if (conversationId) {
      socketService.joinConversation(conversationId);
    }
    return () => {
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
    };
  }, [conversationId]);

  // ─── Fetch Messages (REST) ──────────────────────────────────────────────────
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatApi.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
};

// ─── Send Message (Socket-First + Optimistic UI) ─────────────────────────────

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const sendViaSocket = useCallback(
    async (payload: SendMessagePayload): Promise<void> => {
      const { conversationId, content, file } = payload;

      if (file) {
        // Flow الملفات: رفع أولاً → ثم إرسال عبر Socket
        const uploadResult = await chatApi.uploadFile(file);

        const isImage = file.type.startsWith('image/');
        socketService.sendMessage({
          conversationId,
          type: isImage ? 'image' : 'file',
          fileUrl: uploadResult.fileUrl,
          fileName: uploadResult.fileName || file.name,
          fileSize: uploadResult.fileSize || file.size,
          mimeType: uploadResult.mimeType || file.type,
          content: content || undefined,
        });
      } else {
        // Flow النص فقط
        socketService.sendMessage({
          conversationId,
          content: content || '',
          type: 'text',
        });
      }
    },
    []
  );

  return useMutation({
    mutationFn: sendViaSocket,

    // ─── Optimistic UI (Zero-Latency) ───────────────────────────────────────
    onMutate: async (payload) => {
      const exactKey = ['messages', payload.conversationId];

      // إيقاف أي refetch جاري لمنع الكتابة فوق الرسالة الوهمية
      await queryClient.cancelQueries({ queryKey: exactKey });

      // حفظ Snapshot للتراجع عند الفشل
      const previousMessages = queryClient.getQueryData(exactKey);

      // بناء الرسالة الوهمية
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        _id: tempId,
        conversationId: payload.conversationId,
        content: payload.content || '',
        senderId: user?.id || (user as any)?._id || 'me',
        type: payload.file
          ? payload.file.type.startsWith('image/')
            ? 'image'
            : 'file'
          : 'text',
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        isDeleted: false,
      };

      // إضافة preview للملف
      if (payload.file) {
        optimisticMessage.fileUrl = URL.createObjectURL(payload.file);
        optimisticMessage.fileName = payload.file.name;
      }

      // حقن الرسالة في الكاش فوراً (0ms)
      queryClient.setQueryData(exactKey, (oldData: any) => {
        if (!oldData) return undefined;

        const currentMessages: Message[] = Array.isArray(oldData)
          ? oldData
          : oldData.messages || [];
        const updatedMessages = [...currentMessages, optimisticMessage];

        return Array.isArray(oldData)
          ? updatedMessages
          : { ...oldData, messages: updatedMessages };
      });

      return { previousMessages, exactKey, tempId };
    },

    // ─── نجاح الإرسال ─────────────────────────────────────────────────────
    onSuccess: (_data, _variables, _context) => {
      // لا نعمل شيء هنا — الرسالة الحقيقية ستصل عبر حدث newMessage من الـ Socket
      // والـ Deduplication في useConversationMessages سيستبدل الوهمية بالحقيقية
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },

    // ─── فشل الإرسال — التراجع ──────────────────────────────────────────
    onError: (_err, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(context.exactKey, context.previousMessages);
      }
    },
  });
};

// ─── Delete Message ───────────────────────────────────────────────────────────

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteMessage,
    onSuccess: (_, deletedMessageId) => {
      // Soft Delete في كل الكاشات المتعلقة بالرسائل
      queryClient.setQueriesData({ queryKey: ['messages'] }, (oldData: any) => {
        if (!oldData) return oldData;

        const currentMessages: Message[] = Array.isArray(oldData)
          ? oldData
          : oldData.messages || [];

        const updatedMessages = currentMessages.map((msg) =>
          String(msg._id) === String(deletedMessageId)
            ? {
                ...msg,
                isDeleted: true,
                content: '🚫 تم حذف هذه الرسالة',
                fileUrl: undefined,
              }
            : msg
        );

        return Array.isArray(oldData)
          ? updatedMessages
          : { ...oldData, messages: updatedMessages };
      });
    },
  });
};
