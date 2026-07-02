import { motion, AnimatePresence } from 'motion/react';
import { Send, Crown, Lock, Sparkles, MessageCircle, Loader2, Paperclip, Trash2, X, MoreVertical, Archive, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useConversations, useConversationMessages, useSendMessage, useDeleteMessage, useMarkAsRead, useArchiveConversation, useUnarchiveConversation, useLeaveConversation } from './hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { compressImage } from '../lib/imageCompression';
import type { Conversation, Participant } from './api/chatApi';

interface MessagingProps {
  onPremiumAction: (action: () => void) => void;
  isPremium: boolean;
}

export default function Messaging({ onPremiumAction, isPremium }: MessagingProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [conversationTab, setConversationTab] = useState<'active' | 'archived'>('active');
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUser = useAuthStore((state) => state.user);

  // Queries only run if premium
  const { data: conversations, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages } = useConversationMessages(selectedConversationId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: deleteMessage, isPending: isDeleting, variables: deletingId } = useDeleteMessage();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: archiveConversation, isPending: isArchiving } = useArchiveConversation();
  const { mutate: unarchiveConversation, isPending: isUnarchiving } = useUnarchiveConversation();
  const { mutate: leaveConversation, isPending: isLeaving } = useLeaveConversation();

  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markAsRead]);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.chat-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const messages = messagesData?.messages || [];

  const currentUserId = currentUser?.id || (currentUser as any)?._id || '';

  const filteredConversations = conversations?.filter(c => {
    const isArchived = (c as any).archivedBy && ((c as any).archivedBy as any)[currentUserId];
    if (conversationTab === 'archived') return isArchived;
    return !isArchived;
  }) || [];

  const currentConversation = conversations?.find(c => c._id === selectedConversationId);
  const isArchived = (currentConversation as any)?.archivedBy && ((currentConversation as any).archivedBy as any)[currentUserId];

  // Automatically select the first conversation if none is selected
  useEffect(() => {
    if (!selectedConversationId && conversations && conversations.length > 0) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !selectedConversationId) return;

    let fileToSend = selectedFile;
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      fileToSend = await compressImage(selectedFile);
    }

    sendMessage(
      {
        conversationId: selectedConversationId,
        content: messageText.trim() || 'ملف مرفق',
        file: fileToSend || undefined,
      },
      {
        onSuccess: () => {
          setMessageText('');
          setSelectedFile(null);
          setFilePreview(null);
        },
      }
    );
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to get the other participant (assuming the patient is viewing, we look for admin/doctor)
  const getOtherParticipant = (conv: Conversation): Participant | undefined => {
    return conv.participants?.find((p) => p.role !== 'patient') || conv.participants?.[0];
  };

  const activeConversation = conversations?.find((c) => c._id === selectedConversationId);
  const activeParticipant = activeConversation ? getOtherParticipant(activeConversation) : null;

  // تم إيقاف شرط الاشتراك مؤقتاً للتجربة
  if (false && !isPremium) {
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            المراسلة المباشرة
          </h1>
          <p className="text-muted-foreground text-lg mb-12">تواصل مع طبيبك الخاص</p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary p-12 rounded-[3rem] text-white text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

            <div className="relative">
              <div className="inline-flex p-6 bg-white/20 backdrop-blur-xl rounded-3xl mb-6">
                <Lock className="w-16 h-16" />
              </div>

              <h2 className="text-3xl font-bold mb-4">ميزة حصرية للمشتركين</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                احصل على الاشتراك المميز للتواصل المباشر مع طبيبك الخاص والحصول على استشارات فورية
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPremiumAction(() => {})}
                className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl inline-flex items-center gap-3"
              >
                <Crown className="w-6 h-6" />
                <span>اشترك الآن</span>
              </motion.button>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
                  <Sparkles className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">رد فوري</h3>
                  <p className="text-sm text-white/80">احصل على إجابات سريعة لأسئلتك</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
                  <MessageCircle className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">دعم مستمر</h3>
                  <p className="text-sm text-white/80">تواصل مع طبيبك في أي وقت</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
                  <Crown className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">خطط مخصصة</h3>
                  <p className="text-sm text-white/80">احصل على خطة غذائية مخصصة لك</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
          المراسلة المباشرة
        </h1>
        <p className="text-muted-foreground text-lg mb-8">تواصل مع طبيبك الخاص</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="flex bg-white/50 p-1 rounded-xl shadow-sm border border-primary/10">
              <button
                onClick={() => setConversationTab('active')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${conversationTab === 'active' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                النشطة
              </button>
              <button
                onClick={() => setConversationTab('archived')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${conversationTab === 'archived' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                المؤرشفة
              </button>
            </div>

            {isLoadingConversations ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-primary/10 text-center shadow-sm">
                <p className="text-muted-foreground">لا توجد محادثات حالياً.</p>
                <p className="text-xs text-primary mt-2">سيتم فتح محادثة قريباً بواسطة طبيبك.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                if (!other) return null;

                return (
                  <motion.div
                    key={conv._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedConversationId(conv._id)}
                    className={`p-6 rounded-3xl cursor-pointer transition-all border-2 ${
                      selectedConversationId === conv._id
                        ? 'bg-white border-primary shadow-lg'
                        : 'bg-white border-transparent shadow-sm hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {other.images?.[0] ? (
                        <img src={other.images[0]} alt={other.fullName} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {other.fullName?.charAt(0) || 'د'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold mb-1 truncate">{other.fullName}</h3>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {other.role === 'admin' ? 'الإدارة' : 'طبيب متابع'}
                        </p>
                        <p className="text-sm text-foreground/70 truncate">{conv.lastMessage?.content || 'لا توجد رسائل...'}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-primary/10 shadow-lg overflow-hidden flex flex-col h-[600px]"
          >
            {selectedConversationId ? (
              <>
                <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex-shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    {activeParticipant?.images?.[0] ? (
                      <img src={activeParticipant.images[0]} alt={activeParticipant.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {activeParticipant?.fullName?.charAt(0) || 'د'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold">{activeParticipant?.fullName || 'الطبيب'}</h3>
                      <p className="text-sm text-white/80">
                        {activeParticipant?.role === 'admin' ? 'الإدارة' : 'طبيبك الخاص'}
                      </p>
                    </div>
                    
                    <div className="mr-auto relative chat-dropdown">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-primary/10 overflow-hidden z-50 text-foreground"
                          >
                            <div className="p-1">
                              <button
                                onClick={() => {
                                  setShowDropdown(false);
                                  if (isArchived) {
                                    unarchiveConversation(selectedConversationId);
                                  } else {
                                    archiveConversation(selectedConversationId);
                                  }
                                }}
                                disabled={isArchiving || isUnarchiving}
                                className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                              >
                                <Archive className="w-4 h-4 text-primary" />
                                {isArchived ? 'إلغاء الأرشفة' : 'أرشفة المحادثة'}
                              </button>
                              {currentConversation?.isGroup && (
                                <button
                                  onClick={() => {
                                    setShowDropdown(false);
                                    if (window.confirm('هل أنت متأكد من مغادرة هذه المحادثة؟')) {
                                      leaveConversation(selectedConversationId);
                                      setSelectedConversationId(null);
                                    }
                                  }}
                                  disabled={isLeaving}
                                  className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 mt-1"
                                >
                                  <LogOut className="w-4 h-4" />
                                  مغادرة المحادثة
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground flex-col">
                      <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                      <p>مرحباً بك في المحادثة المباشرة!</p>
                      <p className="text-sm mt-2">يمكنك إرسال استفساراتك هنا وسيقوم الطبيب بالرد عليك.</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const senderData = msg.senderId;
                      const senderIdStr = typeof senderData === 'object' && senderData !== null ? (senderData as any)._id : senderData;
                      const myId = currentUser?.id || (currentUser as any)?._id;
                      const isMe = senderIdStr === myId;

                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex w-full group ${isMe ? 'justify-end' : 'justify-start'} ${deletingId === msg._id ? 'opacity-50' : ''}`}
                        >
                          {isMe && (
                            <button
                            onClick={() => setMessageToDelete(msg._id)}
                            disabled={isDeleting}
                              className={`${deletingId === msg._id ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity self-center mx-2 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full`}
                              title="حذف الرسالة"
                            >
                              {deletingId === msg._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <div className={`max-w-[75%] min-w-[80px] px-4 py-3 rounded-2xl shadow-sm flex flex-col ${
                            isMe
                              ? 'bg-gradient-to-br from-primary to-accent text-white rounded-bl-sm'
                              : 'bg-white border border-primary/10 text-foreground rounded-br-sm'
                          }`}>
                            {msg.content && msg.content !== 'ملف مرفق' && (
                              <p className="mb-1 leading-relaxed text-sm text-start break-words">{msg.content}</p>
                            )}
                            {msg.fileUrl && (
                              <div className="mt-2">
                                {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileUrl) ? (
                                  <img src={msg.fileUrl} alt="Attachment" className="max-w-full rounded-lg object-contain max-h-[250px]" />
                                ) : (
                                  <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1 opacity-80 hover:opacity-100">
                                    <Paperclip className="w-3 h-3" />
                                    عرض المرفق
                                  </a>
                                )}
                              </div>
                            )}
                            <p className={`text-[10px] mt-1 text-end ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 bg-white flex-shrink-0">
                {/* File Preview Area */}
                {selectedFile && (
                  <div className="mb-3 flex items-center gap-3 p-3 bg-secondary rounded-xl border border-border">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center text-primary">
                        <Paperclip className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={removeFile} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                          if (file.type.startsWith('image/')) {
                            setFilePreview(URL.createObjectURL(file));
                          } else {
                            setFilePreview(null);
                          }
                        }
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary flex-shrink-0 hover:bg-secondary/80 transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </motion.button>

                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="اكتب استفسارك هنا... (اضغط Enter للإرسال)"
                      className="flex-1 px-5 py-3 bg-secondary rounded-3xl border-none outline-none focus:ring-2 focus:ring-primary resize-none max-h-32 min-h-[48px] text-sm"
                      rows={1}
                    />

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={isSending || (!messageText.trim() && !selectedFile)}
                      className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0 disabled:opacity-50"
                    >
                      {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50/50">
                <div className="text-center p-6">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-primary/40" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">المراسلة المباشرة</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    يمكنك اختيار محادثة من القائمة للتواصل المباشر والاستفسار عن أي شيء يخص خطتك
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {messageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-bold mb-2">حذف الرسالة</h3>
              <p className="text-muted-foreground mb-6 text-sm">هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMessageToDelete(null)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors font-medium text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    deleteMessage(messageToDelete);
                    setMessageToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors font-medium text-sm"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
