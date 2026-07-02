import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Crown, Loader2, Calendar } from 'lucide-react';
import { useProgramUsers } from '../../workOuts/hooks/useUserTrainingPrograms';
import { useAllUsers } from '../hooks/useDoctorUsers';

interface ProgramUsersModalProps {
  programId: string;
  programTitle: string;
  onClose: () => void;
}

export function ProgramUsersModal({ programId, programTitle, onClose }: ProgramUsersModalProps) {
  const { data: programUsers, isLoading: loadingAssignments } = useProgramUsers(programId);
  const { data: usersResponse, isLoading: loadingUsers } = useAllUsers(1, 1000);

  const users = Array.isArray(programUsers) 
    ? programUsers 
    : (programUsers as any)?.data 
      ? (Array.isArray((programUsers as any).data) ? (programUsers as any).data : [])
      : [];

  const allUsers = usersResponse?.data ?? [];
  const isLoading = loadingAssignments || loadingUsers;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'غير محدد';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">المشتركون في البرنامج</h2>
              <p className="text-sm text-white/70">{programTitle}</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-primary">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-bold">جاري تحميل المشتركين...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold text-lg">لا يوجد مشتركين</p>
              <p className="text-sm">لم يتم تعيين هذا البرنامج لأي مريض حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {users.map((item: any) => {
                  let u: any = null;
                  
                  // فحص حالات الـ Populate المختلفة
                  if (item.fullName) {
                    u = item; // المستخدمون مباشرة
                  } else if (item.userId && typeof item.userId === 'object' && item.userId.fullName) {
                    u = item.userId; // Populate على حقل userId
                  } else if (item.user && typeof item.user === 'object' && item.user.fullName) {
                    u = item.user; // Populate على حقل user
                  } else {
                    // إذا لم تكن البيانات Populated، نستخرج الـ ID ونبحث في قائمة allUsers
                    let extractedId = item.user?._id || item.user || item.userId?._id || item.userId;
                    if (typeof extractedId === 'object' && extractedId !== null) {
                      extractedId = extractedId._id || extractedId.id;
                    }
                    const stringId = typeof extractedId === 'string' ? extractedId : String(extractedId);
                    u = allUsers.find((usr: any) => usr.id === stringId || usr._id === stringId);
                  }

                  // إذا كان الـ userId بـ null (بيانات تالفة في الداتا بيز) نعرضه كمستخدم مجهول بدل ما نخفيه
                  const fallbackUser = {
                    fullName: 'مستخدم مجهول (بيانات مفقودة)',
                    email: 'No Email',
                    isPremium: false
                  };

                  const displayUser = u || fallbackUser;
                  
                  return (
                    <motion.div
                      key={item._id || item.id || Math.random()}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-secondary rounded-2xl p-4 flex items-center gap-4 border border-primary/5 hover:border-primary/20 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-inner ${!u ? 'bg-red-400' : 'bg-gradient-to-br from-primary to-accent'}`}>
                        {displayUser.fullName?.charAt(0)?.toUpperCase() || '؟'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base truncate flex items-center gap-2 ${!u ? 'text-red-500' : ''}`}>
                          {displayUser.fullName}
                          {displayUser.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="truncate max-w-[120px]">{displayUser.email}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> تم التعيين: {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
