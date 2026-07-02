import { motion } from 'motion/react';
import { Plus, Loader2 } from 'lucide-react';
import { useAllUsers } from '../../hooks/useDoctorUsers';
import { useConversations } from '../../../Messaging/hooks/useChat';
import { useAuthStore } from '../../../store/authStore';

interface OverviewSectionProps {
  onShowAddPatient: () => void;
}

export function OverviewSection({ onShowAddPatient }: OverviewSectionProps) {
  // جلب أحدث المرضى (نجلب 50 عشان نقدر نطابق أسماء الرسايل، ونعرض أول 5 بس كمرضى)
  const { data: usersData, isLoading } = useAllUsers(1, 50);
  const realRecentPatients = usersData?.data || [];
  
  const currentUser = useAuthStore((state) => state.user);
  const myId = currentUser?.id || (currentUser as any)?._id || (currentUser as any)?.userId;
  
  const { data: conversations, isLoading: isLoadingConversations } = useConversations();
  
  // تصفية المحادثات للحصول على أحدث الرسائل
  const activeConversations = conversations?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground text-base md:text-lg">مرحباً د. سارة، إليك ملخص اليوم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">المرضى الحديثون</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowAddPatient}
                className="px-4 py-2 bg-gradient-to-br from-primary to-accent text-white rounded-full text-sm font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مريض</span>
              </motion.button>
            </div>
          </div>
          <div className="space-y-3 w-full">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : realRecentPatients.length > 0 ? (
              realRecentPatients.slice(0, 5).map((patient: any, idx: number) => (
                <motion.div
                  key={patient._id || patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all w-full"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                    {patient.fullName?.charAt(0) || 'م'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold truncate">{patient.fullName}</h4>
                      {patient.role === 'admin' || patient.role === 'doctor' ? (
                        <div className="w-4 h-4 text-accent flex-shrink-0" title={patient.role} />
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(patient.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4 bg-secondary/50 rounded-2xl">
                لا يوجد مرضى مضافين حتى الآن
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">الرسائل الحديثة</h2>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
              {conversations?.filter(c => {
                const unread = c.unreadCount && (c.unreadCount as any)[myId];
                return unread && unread > 0;
              }).length || 0}
            </div>
          </div>
          <div className="space-y-3">
            {isLoadingConversations ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : activeConversations.length > 0 ? (
              activeConversations.map((conv, idx) => {
                // البحث عن المريض الآخر
                const otherParticipant = conv.participants?.find((p: any) => {
                  const pId = typeof p === 'string' ? p : (p._id || p.id);
                  return String(pId) !== String(myId);
                }) || conv.participants?.[0];
                
                const otherId = typeof otherParticipant === 'string' ? otherParticipant : (otherParticipant as any)?._id;
                const foundUser = realRecentPatients.find((u: any) => String(u._id || u.id) === String(otherId));
                const patientName = foundUser ? foundUser.fullName : (typeof otherParticipant === 'object' && otherParticipant.fullName ? otherParticipant.fullName : 'مريض غير معروف');
                
                const isUnread = conv.unreadCount && (conv.unreadCount as any)[myId] > 0;
                const lastMsgContent = typeof conv.lastMessage === 'object' && conv.lastMessage !== null 
                               ? (conv.lastMessage as any).content 
                               : 'رسالة جديدة...';
                
                return (
                  <motion.div
                    key={conv._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: -5 }}
                    className={`p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all ${
                      isUnread ? 'bg-primary/5 border border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-bold ${isUnread ? 'text-primary' : ''}`}>{patientName}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${isUnread ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{lastMsgContent}</p>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground p-4 bg-secondary/50 rounded-2xl">
                لا توجد رسائل حديثة
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
