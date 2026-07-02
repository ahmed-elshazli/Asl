import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateUser } from '../hooks/useDoctorUsers';
import type { CreateUserPayload } from '../api/doctorUsersApi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddPatientModalProps {
  onClose: () => void;
}

type FormState = Omit<CreateUserPayload, 'age' | 'height' | 'weight'> & {
  age: number | '';
  height: number | '';
  weight: number | '';
};

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

export function AddPatientModal({ onClose }: AddPatientModalProps) {
  const [form, setForm] = useState<FormState>({
    fullName: '', email: '', password: '', phone: '',
    gender: 'male', age: '', height: '', weight: '',
    country: '', role: 'patient',
  });
  const [success, setSuccess] = useState(false);

  const { mutate: createUser, isPending, error } = useCreateUser();

  const setField = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const numericKeys = ['age', 'height', 'weight'];
      setForm(f => ({
        ...f,
        [key]: numericKeys.includes(key)
          ? e.target.value === '' ? '' : Number(e.target.value)
          : e.target.value,
      }));
    };

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.password || !form.phone) return;
    const payload: CreateUserPayload = {
      ...form,
      age: Number(form.age) || 0,
      height: Number(form.height) || 0,
      weight: Number(form.weight) || 0,
    };
    createUser(payload, {
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
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">إضافة مستخدم جديد</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="الاسم الكامل *">
              <input className={cls.input} placeholder="أحمد محمد"
                value={form.fullName} onChange={setField('fullName')} />
            </Field>
            <Field label="البريد الإلكتروني *">
              <input type="email" className={cls.input} placeholder="user@email.com"
                value={form.email} onChange={setField('email')} />
            </Field>
            <Field label="كلمة المرور *">
              <input type="password" className={cls.input} placeholder="••••••••"
                value={form.password} onChange={setField('password')} />
            </Field>
            <Field label="الهاتف *">
              <input className={cls.input} placeholder="+201234567890"
                value={form.phone} onChange={setField('phone')} />
            </Field>
            <Field label="البلد">
              <input className={cls.input} placeholder="مصر"
                value={form.country} onChange={setField('country')} />
            </Field>
            <Field label="الجنس">
              <select className={cls.select} value={form.gender} onChange={setField('gender')}>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </Field>
            <Field label="العمر">
              <input type="number" min={0} className={cls.input} placeholder="25"
                value={form.age} onChange={setField('age')} />
            </Field>
            <Field label="الوزن (كجم)">
              <input type="number" min={0} className={cls.input} placeholder="70"
                value={form.weight} onChange={setField('weight')} />
            </Field>
            <Field label="الطول (سم)">
              <input type="number" min={0} className={cls.input} placeholder="175"
                value={form.height} onChange={setField('height')} />
            </Field>
            <Field label="الدور">
              <select className={cls.select} value={form.role} onChange={setField('role')}>
                <option value="patient">مريض</option>
                <option value="doctor">طبيب</option>
                <option value="admin">مسؤول</option>
              </select>
            </Field>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 text-center">
              حدث خطأ. تحقق من البيانات وحاول مجدداً.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/10 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={isPending || success}
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" />
              : success ? <><CheckCircle2 className="w-5 h-5" /> تم الإنشاء بنجاح!</>
              : <><UserPlus className="w-5 h-5" /> إنشاء المستخدم</>}
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
              <h3 className="text-xl font-bold">تم إنشاء المستخدم بنجاح!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}