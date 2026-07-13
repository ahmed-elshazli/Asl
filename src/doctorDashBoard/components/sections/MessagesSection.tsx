import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, MessageCircle, Search, Send, Paperclip, Loader2, MoreVertical, LogOut, Edit3, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useConversations, useConversationMessages, useSendMessage, useDeleteMessage, useMarkAsRead, useLeaveConversation, useUpdateGroupName, useAddParticipant, useRemoveParticipant } from '../../../Messaging/hooks/useChat';
import { useAllUsers } from '../../hooks/useDoctorUsers';
import { useAuthStore } from '../../../store/authStore';
import { compressImage } from '../../../lib/imageCompression';
import type { Conversation } from '../../../Messaging/api/chatApi';
import ConfirmModal from '../../../components/ConfirmModal';

interface MessagesSectionProps {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
}

export function MessagesSection({ selectedConversationId, setSelectedConversationId }: MessagesSectionProps) {
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participantIdToAdd, setParticipantIdToAdd] = useState('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUser = useAuthStore((state) => state.user);

  const { data: conversations, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages } = useConversationMessages(selectedConversationId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: deleteMessage, isPending: isDeleting, variables: deletingId } = useDeleteMessage();
  const { mutate: markAsRead } = useMarkAsRead();
  // const { mutate: archiveConversation, isPending: isArchiving } = useArchiveConversation();
  // const { mutate: unarchiveConversation, isPending: isUnarchiving } = useUnarchiveConversation();
  const { mutate: leaveConversation, isPending: isLeaving } = useLeaveConversation();
  const { mutate: updateGroupName, isPending: isUpdatingName } = useUpdateGroupName();
  const { mutate: addParticipant, isPending: isAddingParticipant } = useAddParticipant();
  const { mutate: removeParticipant, isPending: isRemovingParticipant } = useRemoveParticipant();

  const { data: usersData } = useAllUsers(1, 100);
  const availableUsers = usersData?.data || [];

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

  const filteredConversations = conversations || [];

  const currentConversation = conversations?.find(c => c._id === selectedConversationId);

  // Auto-scroll to bottom (with timeout to ensure DOM paints new messages first)
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50); // تأخير بسيط جداً لضمان قيام React بإنهاء الـ Re-render قبل التمرير
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !selectedConversationId) return;

    let fileToSend = selectedFile;
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      fileToSend = await compressImage(selectedFile);
    }

    // إفراغ الحقول فوراً (Optimistic — لا ننتظر استجابة السيرفر)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getOtherParticipant = (conv: Conversation): any => {
    const myId = currentUser?.id || (currentUser as any)?._id || (currentUser as any)?.userId;
    // Find the participant that is not the current user
    const otherParticipant = conv.participants?.find((p: any) => {
      const pId = typeof p === 'string' ? p : (p._id || p.id);
      return String(pId) !== String(myId);
    }) || conv.participants?.[0];

    const otherId = typeof otherParticipant === 'string' ? otherParticipant : (otherParticipant as any)?._id;
    
    // Look up the user details from availableUsers
    const foundUser = availableUsers.find((u: any) => String(u._id || u.id) === String(otherId));
    
    // Return populated user if found, or the participant object if it was already populated, or a fallback
    if (foundUser) return foundUser;
    if (typeof otherParticipant === 'object' && otherParticipant.fullName) return otherParticipant;
    
    return { _id: otherId, fullName: 'مستخدم غير معروف' };
  };

  const activeConversation = conversations?.find((c) => c._id === selectedConversationId);
  const activeParticipant = activeConversation ? getOtherParticipant(activeConversation) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl md:text-4xl font-bold mb-2">الرسائل</h1>
      <p className="text-muted-foreground text-base md:text-lg mb-8">تواصل مع مرضاك</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg flex flex-col h-[700px]">
            <div className="relative mb-4 flex-shrink-0">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن محادثة..."
                className="w-full pr-12 pl-6 py-3 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {isLoadingConversations ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm mt-10">لا توجد محادثات</p>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  if (!other) return null;

                  return (
                    <motion.div
                      key={conv._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedConversationId(conv._id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all ${
                        selectedConversationId === conv._id
                          ? 'bg-gradient-to-br from-primary to-accent text-white'
                          : 'hover:bg-secondary border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {other.images?.[0] ? (
                           <img src={other.images[0]} alt={other.fullName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                            selectedConversationId === conv._id
                              ? 'bg-white/20'
                              : 'bg-gradient-to-br from-primary to-accent text-white'
                          }`}>
                            {other.fullName?.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{other.fullName}</h4>
                          <p className={`text-xs truncate mt-1 ${
                            selectedConversationId === conv._id
                              ? 'text-white/80'
                              : 'text-muted-foreground'
                          }`}>
                            {typeof conv.lastMessage === 'object' && conv.lastMessage !== null 
                               ? (conv.lastMessage as any).content 
                               : 'عرض المحادثة...'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-primary/10 shadow-lg overflow-hidden flex flex-col h-[700px]">
          {selectedConversationId ? (
            <>
              <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex-shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  {activeParticipant?.images?.[0] ? (
                    <img src={activeParticipant.images[0]} alt={activeParticipant.fullName} className="w-14 h-14 rounded-full object-cover border-2 border-white/20" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {activeParticipant?.fullName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{activeParticipant?.fullName}</h3>
                    <p className="text-sm text-white/80">مريض</p>
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
                            {currentConversation?.isGroup && (
                              <>
                                <button
                                  onClick={() => {
                                    setShowDropdown(false);
                                    setNewGroupName((currentConversation as any)?.groupName || '');
                                    setShowGroupNameModal(true);
                                  }}
                                  className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 mt-1"
                                >
                                  <Edit3 className="w-4 h-4 text-primary" />
                                  تغيير اسم المجموعة
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDropdown(false);
                                    setShowParticipantsModal(true);
                                  }}
                                  className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 mt-1"
                                >
                                  <Users className="w-4 h-4 text-primary" />
                                  إدارة الأعضاء
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDropdown(false);
                                    setShowLeaveConfirm(true);
                                  }}
                                  disabled={isLeaving}
                                  className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 mt-1"
                                >
                                  <LogOut className="w-4 h-4" />
                                  مغادرة المحادثة
                                </button>
                              </>
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
                    <p>لا توجد رسائل حتى الآن.</p>
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const senderData = msg.senderId || msg.sender;
                    const senderIdStr = typeof senderData === 'object' && senderData !== null ? (senderData._id || senderData.id) : senderData;
                    const myId = currentUser?.id || (currentUser as any)?._id || (currentUser as any)?.userId;
                    const isMe = String(senderIdStr) === String(myId);


                    return (
                      <motion.div
                        key={msg._id || `temp-${Date.now()}-${Math.random()}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex w-full group ${isMe ? 'justify-end' : 'justify-start'} ${deletingId === msg._id ? 'opacity-50' : ''}`}
                      >
                        {isMe && !msg.isDeleted && (
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
                          msg.isDeleted
                            ? 'bg-secondary/40 border border-dashed border-muted text-muted-foreground italic'
                            : isMe
                              ? 'bg-gradient-to-br from-primary to-accent text-white rounded-bl-sm'
                              : 'bg-white border border-primary/10 text-foreground rounded-br-sm'
                        }`}>
                          {msg.isDeleted ? (
                            <p className="mb-1 text-sm text-start flex items-center gap-2 opacity-80">
                              🚫 تم حذف هذه الرسالة
                            </p>
                          ) : (
                            <>
                              {msg.fileUrl && (
                                <div className="mb-2">
                                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileUrl) || msg.fileUrl.startsWith('blob:') ? (
                                    <img src={msg.fileUrl} alt="Attachment" className="max-w-full rounded-lg object-contain max-h-[250px]" />
                                  ) : (
                                    <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1 opacity-80 hover:opacity-100">
                                      <Paperclip className="w-3 h-3" />
                                      عرض المرفق
                                    </a>
                                  )}
                                </div>
                              )}
                              {msg.content && msg.content !== 'ملف مرفق' && (
                                <p className="mb-1 leading-relaxed text-sm text-start break-words">{msg.content}</p>
                              )}
                            </>
                          )}
                          <p className={`text-[10px] mt-1 text-end ${msg.isDeleted ? 'text-muted-foreground/70' : isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-primary/10 flex-shrink-0">
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
                <div className="flex items-end gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
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
                    placeholder="اكتب رسالتك... (اضغط Enter للإرسال)"
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
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/30 rounded-3xl p-8 border-2 border-dashed border-border/50 m-4">
              <MessageCircle className="w-16 h-16 mb-4 text-primary/40" />
              <p className="text-xl font-medium text-foreground mb-2">اختر محادثة للبدء</p>
              <p className="text-sm max-w-sm text-center leading-relaxed">
                يمكنك اختيار محادثة من القائمة الجانبية أو البدء بمحادثة جديدة مع مرضاك.
              </p>
            </div>
          )}
        </div>
      </div>

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

      {/* Update Group Name Modal */}
      <AnimatePresence>
        {showGroupNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">تغيير اسم المجموعة</h3>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="اسم المجموعة الجديد"
                className="w-full px-4 py-2 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary mb-6 text-sm"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowGroupNameModal(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors font-medium text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    updateGroupName({ id: selectedConversationId!, name: newGroupName });
                    setShowGroupNameModal(false);
                  }}
                  disabled={isUpdatingName || !newGroupName.trim()}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium text-sm disabled:opacity-50"
                >
                  حفظ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Participants Modal */}
      <AnimatePresence>
        {showParticipantsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">إدارة الأعضاء</h3>
                <button onClick={() => setShowParticipantsModal(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 mb-4">
                <h4 className="text-sm font-bold text-muted-foreground mb-2">الأعضاء الحاليين:</h4>
                <div className="space-y-2">
                  {currentConversation?.participants?.map((p: any) => (
                    <div key={p._id || p} className="flex items-center justify-between bg-secondary p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {p.fullName ? p.fullName.charAt(0) : 'U'}
                        </div>
                        <span className="text-sm font-medium">{p.fullName || 'مستخدم غير معروف'}</span>
                      </div>
                      {p._id !== currentUserId && (
                        <button
                          onClick={() => removeParticipant({ id: selectedConversationId!, participantId: p._id })}
                          disabled={isRemovingParticipant}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                          title="إزالة العضو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-bold text-muted-foreground mb-3">إضافة عضو جديد:</h4>
                <div className="flex gap-2">
                  <select
                    value={participantIdToAdd}
                    onChange={(e) => setParticipantIdToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">اختر مريضاً للإضافة...</option>
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      addParticipant({ id: selectedConversationId!, participantId: participantIdToAdd });
                      setParticipantIdToAdd('');
                    }}
                    disabled={isAddingParticipant || !participantIdToAdd}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    إضافة
                  </button>
                </div>
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
    </motion.div>
  );
}
