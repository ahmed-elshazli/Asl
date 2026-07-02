import { motion, AnimatePresence } from 'motion/react';
import { X, Apple, Save, Loader2, CheckCircle2, ChevronDown, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { UIEvent } from 'react';
import { useCreatePlan } from '../hooks/usePlans';
import { useInfinitePatients } from '../hooks/useDoctorUsers';
import { PlanForm, DEFAULT_FORM, formToPayload } from './PlanForm';
import type { PlanFormState } from './PlanForm';

interface AddPlanModalProps {
  onClose: () => void;
}

// ─── Custom Patient Select Component ──────────────────────────────────────────
function PatientSelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading
  } = useInfinitePatients(debouncedSearch);

  const patients = data?.pages.flatMap(p => p.data) || [];
  const selectedPatient = patients.find(p => ((p as any)._id || p.id) === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = (e: UIEvent<HTMLUListElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all flex items-center justify-between"
      >
        <span className={!selectedPatient ? "text-muted-foreground" : "font-bold"}>
          {selectedPatient ? selectedPatient.fullName : '-- كقالب عام (بدون تعيين) --'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-primary/10 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-primary/5 relative">
               <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <input 
                 type="text" 
                 placeholder="ابحث عن مريض..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-secondary/50 rounded-lg py-2 pr-10 pl-4 text-sm outline-none focus:bg-secondary"
               />
            </div>
            <ul 
              onScroll={handleScroll}
              className="max-h-60 overflow-y-auto custom-scrollbar p-2"
            >
              <li 
                onClick={() => { onChange(''); setIsOpen(false); }}
                className={`p-3 rounded-lg cursor-pointer text-sm transition-colors flex items-center gap-2 ${value === '' ? 'bg-primary/10 font-bold text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
              >
                -- كقالب عام (بدون تعيين) --
              </li>
              {patients.map(p => (
                <li 
                  key={(p as any)._id || p.id}
                  onClick={() => { onChange((p as any)._id || p.id); setIsOpen(false); }}
                  className={`p-3 rounded-lg cursor-pointer text-sm transition-colors ${value === ((p as any)._id || p.id) ? 'bg-primary/10 font-bold text-primary' : 'hover:bg-secondary'}`}
                >
                  {p.fullName}
                </li>
              ))}
              {(isLoading || isFetchingNextPage) && (
                <li className="p-3 text-center flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-primary" /></li>
              )}
              {!isLoading && patients.length === 0 && search && (
                <li className="p-3 text-center text-sm text-muted-foreground">لا توجد نتائج</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────────
export function AddPlanModal({ onClose }: AddPlanModalProps) {
  const [form, setForm] = useState<PlanFormState>(DEFAULT_FORM);
  const [success, setSuccess] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const { mutate: createPlan, isPending, error } = useCreatePlan();

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    createPlan(
      { 
        ...formToPayload(form),
        ...(selectedPatientId ? { patient: selectedPatientId } : { patient: '000000000000000000000000' })
      }, 
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(onClose, 1500);
        },
      }
    );
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
              <Apple className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">إنشاء خطة غذائية جديدة</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* حقل تعيين المريض */}
          <div className="mb-6 bg-secondary/30 p-4 rounded-2xl border border-primary/5">
            <label className="block text-sm font-bold text-foreground mb-2">تعيين لمريض (اختياري)</label>
            <PatientSelect value={selectedPatientId} onChange={setSelectedPatientId} />
            <p className="text-xs text-muted-foreground mt-2">
              إذا قمت باختيار مريض، سيتم تعيين هذه الخطة له مباشرة ولن تظهر في القوالب العامة.
            </p>
          </div>

          <PlanForm form={form} onChange={setForm} />
          {error && (
            <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 text-center">
              حدث خطأ أثناء الإنشاء. حاول مجدداً.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/10 flex gap-3 flex-shrink-0">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-secondary font-semibold"
          >إلغاء</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={isPending || success}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" />
              : success ? <><CheckCircle2 className="w-5 h-5" /> تم الحفظ!</>
              : <><Save className="w-5 h-5" /> حفظ الخطة</>}
          </motion.button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center gap-4"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold">تم إنشاء الخطة بنجاح!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}