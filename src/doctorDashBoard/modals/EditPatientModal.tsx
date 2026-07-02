import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useUpdateUser, useUserById } from '../hooks/useDoctorUsers';
import type { UpdateUserPayload } from '../api/doctorUsersApi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditPatientModalProps {
  userId: string;
  onClose: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const cls = {
  input: 'w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm transition-all',
  select: 'w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm cursor-pointer',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export function EditPatientModal({ userId, onClose }: EditPatientModalProps) {
  const [success, setSuccess] = useState(false);

  // يجيب البيانات من الـ cache مباشرة (مش request جديد)
  const { data: user, isLoading } = useUserById(userId);
  const { mutate: updateUser, isPending, error } = useUpdateUser();

  const [form, setForm] = useState<UpdateUserPayload>({});

  // يملي الـ form بالبيانات الحالية لما تيجي من الـ cache
  const getValue = (key: keyof UpdateUserPayload): string | number => {
    if (key in form && form[key] !== undefined) return form[key] as string | number;
    return (user?.[key as keyof typeof user] ?? '') as string | number;
  };

  const setField = (key: keyof UpdateUserPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const numericKeys = ['age', 'height', 'weight'];
      setForm(f => ({
        ...f,
        [key]: numericKeys.includes(key) ? Number(e.target.value) : e.target.value,
      }));
    };

  const handleSubmit = () => {
    if (!user) return;
    // يدمج التغييرات مع البيانات الأصلية
    const payload: UpdateUserPayload = {
      fullName: getValue('fullName') as string,
      phone:    getValue('phone') as string,
      gender:   getValue('gender') as string,
      age:      getValue('age') as number,
      height:   getValue('height') as number,
      weight:   getValue('weight') as number,
      country:  getValue('country') as string,
    };
    updateUser({ id: userId, payload }, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(onClose, 1500);
      },
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
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <div>
              <h2 className="text-xl font-bold">تعديل البيانات</h2>
              {user && <p className="text-sm text-white/70">{user.email}</p>}
            </div>
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
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-14 bg-secondary rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Field label="الاسم الكامل">
                <input className={cls.input} value={getValue('fullName')} onChange={setField('fullName')} />
              </Field>
              <Field label="الهاتف">
                <input className={cls.input} value={getValue('phone')} onChange={setField('phone')} />
              </Field>
              <Field label="البلد">
                <input className={cls.input} value={getValue('country')} onChange={setField('country')} />
              </Field>
              <Field label="الجنس">
                <select className={cls.select} value={getValue('gender')} onChange={setField('gender')}>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </Field>
              <Field label="العمر">
                <input type="number" min={0} className={cls.input}
                  value={getValue('age')} onChange={setField('age')} />
              </Field>
              <Field label="الوزن (كجم)">
                <input type="number" min={0} className={cls.input}
                  value={getValue('weight')} onChange={setField('weight')} />
              </Field>
              <div className="col-span-2">
                <Field label="الطول (سم)">
                  <input type="number" min={0} className={cls.input}
                    value={getValue('height')} onChange={setField('height')} />
                </Field>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 text-center mt-4">
              حدث خطأ أثناء التحديث. حاول مجدداً.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/10 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={isPending || success || isLoading}
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" />
              : success ? <><CheckCircle2 className="w-5 h-5" /> تم الحفظ بنجاح!</>
              : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
          </motion.button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold">تم تحديث البيانات بنجاح!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}