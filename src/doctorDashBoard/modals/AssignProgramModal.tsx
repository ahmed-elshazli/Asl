import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Search, Loader2, CheckCircle2, Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInfinitePatients } from '../hooks/useDoctorUsers';
import { useTrainingPrograms } from '../../workOuts/hooks/useTrainingPrograms';
import { useAssignProgram, useUserPrograms } from '../../workOuts/hooks/useUserTrainingPrograms';
import type { ApiUser } from '../api/doctorUsersApi';
import type { TrainingProgram } from '../../workOuts/api/trainingProgramsApi';

interface AssignProgramModalProps {
  preSelectedUser?: { id: string; name: string } | null;
  onClose: () => void;
}

export function AssignProgramModal({ preSelectedUser, onClose }: AssignProgramModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<ApiUser | { id: string; fullName: string } | null>(
    preSelectedUser ? { id: preSelectedUser.id, fullName: preSelectedUser.name } : null
  );
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [patientSearch, setPatientSearch]     = useState('');
  
  // حقول إضافية مطلوبة في الباك إند
  const [durationInDays, setDurationInDays] = useState<number>(1);
  const [repeatCount, setRepeatCount]       = useState<number>(1);

  const [success, setSuccess]                 = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ─── Debounce Search ───
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(patientSearch), 500);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  const { data: usersResponse, isLoading: loadingUsers, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePatients(debouncedSearch);
  const { data: programsResponse, isLoading: loadingPrograms } = useTrainingPrograms();
  const { mutate: assignProgram, isPending } = useAssignProgram();

  const currentPatientId = selectedPatient ? ((selectedPatient as any)._id || (selectedPatient as any).id) : null;
  const { data: userPrograms } = useUserPrograms(currentPatientId || '');
  
  const [showWarning, setShowWarning] = useState(false);

  const patients = usersResponse?.pages.flatMap(p => p.data) || [];

  // قد يكون الرد مصفوفة مباشرة أو كائن يحتوي على data
  const programs: TrainingProgram[] = Array.isArray(programsResponse) 
    ? programsResponse 
    : (programsResponse as any)?.data ?? [];

  const canSubmit = selectedPatient && selectedProgram && !isPending;

  const isProgramAlreadyAssigned = selectedProgram && userPrograms?.some((up: any) => 
    (up.programId?._id === selectedProgram._id) || (up.programId === selectedProgram._id)
  );

  const executeAssign = () => {
    assignProgram({
      userId: currentPatientId,
      programId: selectedProgram!._id,
      durationInDays,
      repeatCount,
    }, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(onClose, 1500);
      },
    });
  };

  const handleAssign = () => {
    if (!canSubmit) return;
    
    if (isProgramAlreadyAssigned && !showWarning) {
      setShowWarning(true);
      return;
    }
    
    executeAssign();
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
              <h2 className="text-xl font-bold">تعيين برنامج تدريبي</h2>
              <p className="text-sm text-white/70">اختر المريض والبرنامج المناسب</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* ─── Select Patient ─── */}
          {!preSelectedUser ? (
            <div>
              <p className="text-sm font-bold mb-3">اختر المريض</p>
              <div className="relative mb-3">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  placeholder="ابحث باسم المريض..."
                  className="w-full pr-11 pl-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div 
                className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar"
                onScroll={(e) => {
                  const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
                  if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
              >
                {loadingUsers && patients.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 bg-secondary rounded-2xl animate-pulse" />
                  ))
                ) : patients.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4 text-sm">لا يوجد مرضى</p>
                ) : (
                  <>
                    {patients.map((patient: ApiUser) => (
                      <motion.div key={(patient as any)._id || (patient as any).id} whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedPatient(
                          ((selectedPatient as any)?._id || (selectedPatient as any)?.id) === ((patient as any)._id || (patient as any).id) ? null : patient
                        )}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                          ((selectedPatient as any)?._id || (selectedPatient as any)?.id) === ((patient as any)._id || (patient as any).id)
                            ? 'bg-gradient-to-br from-primary to-accent text-white'
                            : 'bg-secondary hover:bg-primary/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          ((selectedPatient as any)?._id || (selectedPatient as any)?.id) === ((patient as any)._id || (patient as any).id) ? 'bg-white/20' : 'bg-gradient-to-br from-primary to-accent text-white'
                        }`}>
                          {patient.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{patient.fullName}</p>
                          <p className={`text-xs truncate ${((selectedPatient as any)?._id || (selectedPatient as any)?.id) === ((patient as any)._id || (patient as any).id) ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {patient.email}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {(loadingUsers || isFetchingNextPage) && (
                      <div className="flex justify-center p-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-secondary p-4 rounded-2xl border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">المريض المحدد</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {preSelectedUser.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold text-lg">{preSelectedUser.name}</p>
              </div>
            </div>
          )}

          {/* ─── Select Program ─── */}
          <div>
            <p className="text-sm font-bold mb-3">اختر البرنامج التدريبي</p>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {loadingPrograms ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-secondary rounded-2xl animate-pulse" />
                ))
              ) : programs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-sm">لا توجد برامج تدريبية</p>
              ) : (
                programs.map((program: TrainingProgram) => (
                  <motion.div key={program._id} whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedProgram(
                      selectedProgram?._id === program._id ? null : program
                    )}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                      selectedProgram?._id === program._id
                        ? 'bg-gradient-to-br from-primary to-accent text-white'
                        : 'bg-secondary hover:bg-primary/10'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      selectedProgram?._id === program._id ? 'bg-white/20' : 'bg-gradient-to-br from-primary to-accent'
                    }`}>
                      <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{program.title}</p>
                      <p className={`text-xs ${selectedProgram?._id === program._id ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {program.level === 'beginner' ? 'مبتدئ' : program.level === 'intermediate' ? 'متوسط' : program.level === 'advanced' ? 'متقدم' : program.level} • {program.duration} دقيقة
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ─── Extra Fields ─── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">مدة البرنامج (بالأيام)</label>
              <input 
                type="number" 
                min="1" 
                value={durationInDays}
                onChange={e => setDurationInDays(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">عدد مرات التكرار</label>
              <input 
                type="number" 
                min="1" 
                value={repeatCount}
                onChange={e => setRepeatCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {/* ─── Summary ─── */}
          {selectedPatient && selectedProgram && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-sm"
            >
              <p className="font-bold mb-1">ملخص التعيين</p>
              <p className="text-muted-foreground">
                سيتم تعيين برنامج <span className="font-bold text-foreground">{selectedProgram.title}</span> للمريض <span className="font-bold text-foreground">{selectedPatient.fullName}</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/10 flex gap-3 flex-shrink-0">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-secondary font-semibold"
          >إلغاء</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={!canSubmit}
            onClick={handleAssign}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
            تعيين البرنامج
          </motion.button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center gap-4 z-20"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold">تم تعيين البرنامج بنجاح!</h3>
            </motion.div>
          )}
          
          {showWarning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center p-6 z-20 backdrop-blur-sm"
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">تنبيه</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  هذا البرنامج ({selectedProgram?.title}) معين بالفعل للمريض. هل تريد تعيينه مرة أخرى؟
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowWarning(false)}
                    className="flex-1 py-2 rounded-xl bg-secondary font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    onClick={() => {
                      setShowWarning(false);
                      executeAssign();
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                  >
                    تعيين على أي حال
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
