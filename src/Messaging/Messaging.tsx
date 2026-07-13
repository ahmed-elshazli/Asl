import { motion, AnimatePresence } from 'motion/react';
import { Send, Crown, Lock, MessageCircle, Loader2, Paperclip, Trash2, X, MoreVertical, Archive, LogOut, Check, CheckCheck } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useConversations, useConversationMessages, useSendMessage, useDeleteMessage, useMarkAsRead, useArchiveConversation, useUnarchiveConversation, useLeaveConversation } from './hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { compressImage } from '../lib/imageCompression';
import type { Conversation, Participant, Message } from './api/chatApi';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { TypingIndicator } from './components/TypingIndicator';
import ConfirmModal from '../components/ConfirmModal';

interface MessagingProps {
  onPremiumAction: (action: () => void) => void;
  isPremium: boolean;
}

// ─── Date Divider Helper ──────────────────────────────────────────────────────
function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'اليوم';
  if (date.toDateString() === yesterday.toDateString()) return 'أمس';
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function shouldShowDateDivider(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].createdAt).toDateString();
  const curr = new Date(messages[index].createdAt).toDateString();
  return prev !== curr;
}

export default function Messaging({ onPremiumAction, isPremium }: MessagingProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [conversationTab, setConversationTab] = useState<'active' | 'archived'>('active');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = useAuthStore((state) => state.user);
  useDocumentTitle('الرسائل');

  const { data: conversations, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages } = useConversationMessages(selectedConversationId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: deleteMessage, isPending: isDeleting, variables: deletingId } = useDeleteMessage();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: archiveConversation, isPending: isArchiving } = useArchiveConversation();
  const { mutate: unarchiveConversation, isPending: isUnarchiving } = useUnarchiveConversation();
  const { mutate: leaveConversation, isPending: isLeaving } = useLeaveConversation();

  useEffect(() => {
    if (selectedConversationId) markAsRead(selectedConversationId);
  }, [selectedConversationId, markAsRead]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.chat-dropdown')) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const messages = useMemo(() => messagesData?.messages || [], [messagesData]);
  const currentUserId = currentUser?.id || (currentUser as any)?._id || '';
  
  // TODO: Wire this up with socket typing event later
  const isTyping = false;

  const filteredConversations = conversations?.filter(c => {
    const isArch = (c as any).archivedBy && ((c as any).archivedBy as any)[currentUserId];
    return conversationTab === 'archived' ? isArch : !isArch;
  }) || [];

  const currentConversation = conversations?.find(c => c._id === selectedConversationId);
  const isArchived = (currentConversation as any)?.archivedBy && ((currentConversation as any).archivedBy as any)[currentUserId];

  useEffect(() => {
    if (!selectedConversationId && conversations && conversations.length > 0) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !selectedConversationId) return;
    let fileToSend = selectedFile;
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      fileToSend = await compressImage(selectedFile);
    }
    const textToSend = messageText.trim();
    const fileRef = fileToSend;
    setMessageText('');
    setSelectedFile(null);
    setFilePreview(null);
    sendMessage({
      conversationId: selectedConversationId,
      content: textToSend || undefined,
      file: fileRef || undefined,
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getOtherParticipant = (conv: Conversation): Participant | undefined => {
    return conv.participants?.find((p) => p.role !== 'patient') || conv.participants?.[0];
  };

  const activeConversation = conversations?.find((c) => c._id === selectedConversationId);
  const activeParticipant = activeConversation ? getOtherParticipant(activeConversation) : null;

  // Premium gate (disabled)
  if (false && !isPremium) {
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">المراسلة المباشرة</h1>
          <p className="text-muted-foreground text-lg mb-12">تواصل مع طبيبك الخاص</p>
          <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary p-12 rounded-[3rem] text-white text-center">
            <div className="relative">
              <div className="inline-flex p-6 bg-white/20 backdrop-blur-xl rounded-3xl mb-6"><Lock className="w-16 h-16" /></div>
              <h2 className="text-3xl font-bold mb-4">ميزة حصرية للمشتركين</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">احصل على الاشتراك المميز للتواصل المباشر</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onPremiumAction(() => {})} className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl inline-flex items-center gap-3">
                <Crown className="w-6 h-6" /><span>اشترك الآن</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const hasInput = messageText.trim().length > 0 || !!selectedFile;

  return (
    <div className="p-4 md:p-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-1">المراسلة المباشرة</h1>
        <p className="text-muted-foreground text-sm mb-6">تواصل مع طبيبك الخاص</p>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-200px)] min-h-[500px]">
          {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3 overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex bg-secondary/60 p-1 rounded-xl">
              <button
                onClick={() => setConversationTab('active')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${conversationTab === 'active' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >النشطة</button>
              <button
                onClick={() => setConversationTab('archived')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${conversationTab === 'archived' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >المؤرشفة</button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent pr-1">
              {isLoadingConversations ? (
                <div className="flex justify-center p-8"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
              ) : filteredConversations.length === 0 ? (
                <div className="bg-white/80 p-6 rounded-2xl border border-primary/5 text-center">
                  <p className="text-muted-foreground text-sm">لا توجد محادثات</p>
                  <p className="text-xs text-primary/60 mt-1">سيتم فتح محادثة بواسطة طبيبك</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  if (!other) return null;
                  const isActive = selectedConversationId === conv._id;
                  return (
                    <motion.div
                      key={conv._id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedConversationId(conv._id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        isActive
                          ? 'bg-primary/5 border-primary/20 shadow-sm'
                          : 'bg-white/80 border-transparent hover:bg-primary/[0.02] hover:border-primary/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {other.images?.[0] ? (
                            <img src={other.images[0]} alt={other.fullName} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                              {other.fullName?.charAt(0) || 'د'}
                            </div>
                          )}
                          {/* Online dot placeholder */}
                          <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{other.fullName}</h3>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {conv.lastMessage?.content || 'لا توجد رسائل...'}
                          </p>
                        </div>
                        {conv.lastMessage?.createdAt && (
                          <span className="text-[10px] text-muted-foreground/70 flex-shrink-0 self-start mt-1">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* ─── Chat Area ────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-primary/10 shadow-lg overflow-hidden flex flex-col"
          >
            {selectedConversationId ? (
              <>
                {/* ─── Glassmorphism Header ──────────────────────────────────── */}
                <div className="backdrop-blur-md bg-white/90 border-b border-primary/5 px-5 py-4 flex-shrink-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {activeParticipant?.images?.[0] ? (
                        <img src={activeParticipant.images[0]} alt={activeParticipant.fullName} className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base">
                          {activeParticipant?.fullName?.charAt(0) || 'د'}
                        </div>
                      )}
                      <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{activeParticipant?.fullName || 'الطبيب'}</h3>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                        متصل الآن
                      </p>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative chat-dropdown">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-primary/10 overflow-hidden z-50"
                          >
                            <div className="p-1">
                              <button
                                onClick={() => {
                                  setShowDropdown(false);
                                  if (isArchived) unarchiveConversation(selectedConversationId);
                                  else archiveConversation(selectedConversationId);
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
                                    setShowLeaveConfirm(true);
                                  }}
                                  disabled={isLeaving}
                                  className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 mt-0.5"
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

                {/* ─── Messages Area ─────────────────────────────────────────── */}
                <div className="flex-1 px-4 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent bg-[#f8faf9]">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-7 h-7 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground flex-col">
                      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                        <MessageCircle className="w-10 h-10 text-primary/30" />
                      </div>
                      <p className="font-medium">مرحباً بك!</p>
                      <p className="text-xs mt-1 text-center max-w-[240px]">أرسل أول رسالة للتواصل مع طبيبك</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const senderData = msg.senderId;
                        const senderIdStr = typeof senderData === 'object' && senderData !== null ? (senderData as any)._id : senderData;
                        const myId = currentUser?.id || (currentUser as any)?._id;
                        const isMe = senderIdStr === myId;
                        const showDate = shouldShowDateDivider(messages, index);

                        return (
                          <div key={msg._id || `temp-${index}`}>
                            {/* ─── Date Divider ──────────────────────────────── */}
                            {showDate && (
                              <div className="flex items-center justify-center my-4">
                                <span className="px-4 py-1 bg-primary/5 text-primary/60 text-[11px] font-medium rounded-full">
                                  {getDateLabel(msg.createdAt)}
                                </span>
                              </div>
                            )}

                            {/* ─── Message Bubble ────────────────────────────── */}
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                              className={`flex w-full group mb-2 ${isMe ? 'justify-end' : 'justify-start'} ${deletingId === msg._id ? 'opacity-50' : ''}`}
                            >
                              {/* Delete button (sender only) */}
                              {isMe && !msg.isDeleted && (
                                <button
                                  onClick={() => setMessageToDelete(msg._id)}
                                  disabled={isDeleting}
                                  className={`${deletingId === msg._id ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity self-center mx-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full`}
                                  title="حذف"
                                >
                                  {deletingId === msg._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              <div
                                className={`max-w-[70%] min-w-[80px] px-3.5 py-2.5 shadow-sm flex flex-col ${
                                  msg.isDeleted
                                    ? 'bg-secondary/30 border border-dashed border-muted-foreground/20 text-muted-foreground italic rounded-2xl'
                                    : isMe
                                      ? 'bg-gradient-to-br from-primary to-accent text-white rounded-2xl rounded-bl-sm'
                                      : 'bg-white border border-primary/5 text-foreground rounded-2xl rounded-br-sm'
                                }`}
                              >
                                {msg.isDeleted ? (
                                  <p className="text-xs text-start flex items-center gap-1.5 opacity-70 py-0.5">
                                    🚫 تم حذف هذه الرسالة
                                  </p>
                                ) : (
                                  <>
                                    {/* Image / File */}
                                    {msg.fileUrl && (
                                      <div className="mb-1.5">
                                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileUrl) || msg.fileUrl.startsWith('blob:') ? (
                                          <img src={msg.fileUrl} alt="Attachment" className="max-w-full rounded-xl object-contain max-h-[220px]" />
                                        ) : (
                                          <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1 opacity-80 hover:opacity-100">
                                            <Paperclip className="w-3 h-3" />
                                            عرض المرفق
                                          </a>
                                        )}
                                      </div>
                                    )}
                                    {/* Text Content */}
                                    {msg.content && msg.content !== 'ملف مرفق' && (
                                      <p className="leading-relaxed text-[13px] text-start break-words">{msg.content}</p>
                                    )}
                                  </>
                                )}
                                {/* ─── Timestamp + Read Receipts ───────────────── */}
                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <span className={`text-[10px] leading-none ${
                                    msg.isDeleted ? 'text-muted-foreground/50' : isMe ? 'text-white/60' : 'text-muted-foreground/50'
                                  }`}>
                                    {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {isMe && !msg.isDeleted && (
                                    msg.isOptimistic ? (
                                      <Check className={`w-3.5 h-3.5 ${isMe ? 'text-white/50' : 'text-muted-foreground/50'}`} />
                                    ) : (
                                      <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-blue-300' : isMe ? 'text-white/50' : 'text-muted-foreground/50'}`} />
                                    )
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {/* ─── Typing Indicator ─────────────────────────────────── */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <TypingIndicator />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* ─── Input Area ─────────────────────────────────────────────── */}
                <div className="backdrop-blur-md bg-white/90 border-t border-primary/5 px-4 py-3 flex-shrink-0">
                  {/* File Preview */}
                  {selectedFile && (
                    <div className="mb-2.5 flex items-center gap-3 p-2.5 bg-secondary/50 rounded-xl border border-primary/5">
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="w-11 h-11 rounded-lg object-cover" />
                      ) : (
                        <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <Paperclip className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={removeFile} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Input Row */}
                  <div className="flex items-end gap-2 bg-secondary/40 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                          setFilePreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
                        }
                      }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white transition-colors flex-shrink-0"
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
                      placeholder="اكتب رسالتك..."
                      className="flex-1 px-3 py-2.5 bg-transparent border-none outline-none resize-none max-h-28 min-h-[40px] text-sm placeholder:text-muted-foreground/50"
                      rows={1}
                    />

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={handleSendMessage}
                      disabled={isSending || !hasInput}
                      animate={{
                        scale: hasInput ? 1 : 0.9,
                        opacity: hasInput ? 1 : 0.5,
                      }}
                      transition={{ type: 'spring', damping: 15 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-colors ${
                        hasInput ? 'bg-gradient-to-br from-primary to-accent shadow-md' : 'bg-primary/30'
                      }`}
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              /* ─── No Conversation Selected ──────────────────────────────── */
              <div className="flex-1 flex items-center justify-center bg-[#f8faf9]">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
                    <MessageCircle className="w-10 h-10 text-primary/30" />
                  </div>
                  <h3 className="text-xl font-bold mb-1.5 text-foreground">المراسلة المباشرة</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    اختر محادثة من القائمة للتواصل مع طبيبك
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Delete Confirmation Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {messageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-primary/5"
            >
              <h3 className="text-lg font-bold mb-2">حذف الرسالة</h3>
              <p className="text-muted-foreground mb-6 text-sm">هل أنت متأكد من رغبتك في حذف هذه الرسالة؟</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMessageToDelete(null)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors font-medium text-sm"
                >إلغاء</button>
                <button
                  onClick={() => { deleteMessage(messageToDelete); setMessageToDelete(null); }}
                  className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors font-medium text-sm"
                >حذف</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showLeaveConfirm}
        title="مغادرة المحادثة"
        message="هل أنت متأكد من مغادرة هذه المحادثة؟ لا يمكنك التراجع عن هذا الإجراء."
        confirmText="مغادرة"
        variant="warning"
        isLoading={isLeaving}
        onConfirm={() => {
          if (selectedConversationId) {
            leaveConversation(selectedConversationId, {
              onSettled: () => {
                setShowLeaveConfirm(false);
                setSelectedConversationId(null);
              }
            });
          }
        }}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </div>
  );
}
