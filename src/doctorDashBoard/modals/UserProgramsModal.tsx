import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, Trash2, Loader2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useUserPrograms, useUnassignProgram } from '../../workOuts/hooks/useUserTrainingPrograms';
import { useTrainingPrograms } from '../../workOuts/hooks/useTrainingPrograms';
// import type { UserTrainingProgram } from '../../workOuts/api/userTrainingProgramApi';

interface UserProgramsModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export function UserProgramsModal({ userId, userName, onClose }: UserProgramsModalProps) {
  const { data: userPrograms, isLoading: loadingAssignments } = useUserPrograms(userId);
  const { data: allProgramsResponse, isLoading: loadingPrograms } = useTrainingPrograms();
  const { mutate: unassignProgram, isPending: isUnassigning } = useUnassignProgram();
  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null);

  // Debugging
  console.log("UserPrograms API Response:", userPrograms);

  // استخراج المصفوفة بشكل آمن
  let programs: any[] = [];
  if (Array.isArray(userPrograms)) {
    programs = userPrograms;
  } else if (userPrograms && typeof userPrograms === 'object') {
    if (Array.isArray((userPrograms as any).data)) {
      programs = (userPrograms as any).data;
    } else if ((userPrograms as any).data && Array.isArray((userPrograms as any).data.data)) {
      programs = (userPrograms as any).data.data;
    } else if (Array.isArray((userPrograms as any).programs)) {
      programs = (userPrograms as any).programs;
    } else if (Array.isArray((userPrograms as any).userPrograms)) {
      programs = (userPrograms as any).userPrograms;
    }
  }

  let allPrograms: any[] = [];
  if (Array.isArray(allProgramsResponse)) {
    allPrograms = allProgramsResponse;
  } else if (allProgramsResponse && typeof allProgramsResponse === 'object') {
    if (Array.isArray((allProgramsResponse as any).data)) {
      allPrograms = (allProgramsResponse as any).data;
    } else if ((allProgramsResponse as any).data && Array.isArray((allProgramsResponse as any).data.data)) {
      allPrograms = (allProgramsResponse as any).data.data;
    }
  }
  const isLoading = loadingAssignments || loadingPrograms;

  const handleUnassign = (programId: string) => {
    setDeletingProgramId(programId);
    unassignProgram({ userId, programId }, {
      onSettled: () => setDeletingProgramId(null),
    });
  };

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
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">البرامج التدريبية</h2>
              <p className="text-sm text-white/70">البرامج المخصصة للمريض {userName}</p>
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
              <p className="font-bold">جاري تحميل البرامج...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Dumbbell className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold text-lg">لا توجد برامج تدريبية</p>
              <p className="text-sm">لم يتم تعيين أي برنامج تدريبي لهذا المريض حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {programs.map((item: any, index: number) => {
                  let p: any = null;
                  let programId = '';
                  let dateToDisplay = item.createdAt;
                  
                  // فحص جميع الحالات الممكنة للـ Populate من الباك إند
                  if (item.title) {
                    p = item; // البرامج مباشرة
                  } else if (item.program && typeof item.program === 'object' && item.program.title) {
                    p = item.program; // Populate على حقل program
                  } else if (item.programId && typeof item.programId === 'object' && item.programId.title) {
                    p = item.programId; // Populate على حقل programId
                  }
                  
                  if (p) {
                    programId = p._id || p.id;
                  } else {
                    // إذا لم تكن البيانات Populated، نحاول استخراج الـ ID والبحث في allPrograms
                    let extractedId = item.program?._id || item.program || item.programId;
                    if (typeof extractedId === 'object' && extractedId !== null) {
                      extractedId = extractedId._id || extractedId.id;
                    }
                    programId = typeof extractedId === 'string' ? extractedId : String(extractedId);
                    
                    p = allPrograms.find((prog: any) => prog._id === programId);
                  }
                    
                  const isDeleting = deletingProgramId === programId;
                  
                  // إذا لم نتمكن من العثور على البرنامج، نعرض رسالة خطأ بدلاً من الشاشة البيضاء
                  if (!p) {
                    return (
                      <motion.div
                        key={programId || `unknown-${index}`}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 rounded-2xl p-4 flex items-center gap-4 border border-red-100"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-red-700 text-sm">برنامج غير معروف (ID: {programId})</h3>
                          <p className="text-xs text-red-500 mt-1">ربما تم حذف هذا البرنامج من النظام أو يوجد خطأ في البيانات.</p>
                        </div>
                        {programId && (
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            disabled={isUnassigning}
                            onClick={() => handleUnassign(programId)}
                            className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50"
                            title="حذف هذا السجل"
                          >
                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  }
                  
                  return (
                    <motion.div
                      key={p._id || programId || index}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-secondary rounded-2xl p-4 flex items-center gap-4 border border-primary/5 hover:border-primary/20 transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{p.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="bg-white px-2 py-1 rounded-md shadow-sm">
                            {p.level === 'beginner' ? 'مبتدئ' : p.level === 'intermediate' ? 'متوسط' : p.level === 'advanced' ? 'متقدم' : p.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> تم الإضافة: {formatDate(dateToDisplay)}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        disabled={isUnassigning}
                        onClick={() => handleUnassign(programId)}
                        className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50"
                        title="إلغاء تعيين البرنامج"
                      >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </motion.button>
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
