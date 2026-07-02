import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { chatApi } from '../api/chatApi';
import type { CreateConversationPayload, SendMessagePayload, Message } from '../api/chatApi';
import { socketService } from '../api/socketService';

// ─── Conversations ───

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: chatApi.getConversations,
    refetchInterval: 5000, // Fallback to polling
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
    mutationFn: ({ id, name }: { id: string, name: string }) => chatApi.updateGroupName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useAddParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, participantId }: { id: string, participantId: string }) => chatApi.addParticipant(id, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, participantId }: { id: string, participantId: string }) => chatApi.removeParticipant(id, participantId),
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

// ─── Messages ───

export const useConversationMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // تشغيل الـ Socket عند فتح المحادثات
    socketService.connect();

    // الاستماع للرسائل الجديدة
    const unsubscribe = socketService.onNewMessage((newMessage) => {
      // تحديث قائمة الرسائل في الـ Cache فوراً
      queryClient.setQueryData(
        ['messages', newMessage.conversationId],
        (oldData: { messages: Message[]; totalPages: number } | undefined) => {
          if (!oldData) return oldData;
          // التحقق من أن الرسالة غير موجودة مسبقاً (لمنع التكرار إذا كان الباك إند يرسل الرسالة لنفس المرسل)
          if (oldData.messages.some(msg => msg._id === newMessage._id)) return oldData;
          
          return {
            ...oldData,
            messages: [...oldData.messages, newMessage],
          };
        }
      );

      // تحديث قائمة المحادثات لكي تظهر آخر رسالة
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return () => {
      unsubscribe();
      // يمكن إغلاق الـ Socket عند الخروج من كامل التطبيق وليس فقط المكون
    };
  }, [queryClient]);

  // في حال كان الباك إند يعتمد على الـ Rooms، نقوم بالانضمام للمحادثة المحددة
  useEffect(() => {
    if (conversationId) {
      socketService.joinConversation(conversationId);
    }
    return () => {
      if (conversationId) socketService.leaveConversation(conversationId);
    }
  }, [conversationId]);

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatApi.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 3000, // Fallback polling to guarantee real-time if socket fails
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => chatApi.sendMessage(payload),
    onSuccess: (_, variables) => {
      // Invalidate the specific conversation messages
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      // Also invalidate conversations to update the last message snippet
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
