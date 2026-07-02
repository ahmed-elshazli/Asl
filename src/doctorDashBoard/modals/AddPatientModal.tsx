import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Loader2, CheckCircle2, User, Mail, Lock, Phone, Calendar, Activity, ShieldCheck } from 'lucide-react';
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

const codeToCountry: Record<string, string> = {
  '+966': 'السعودية', '+20': 'مصر', '+971': 'الإمارات', '+965': 'الكويت',
  '+974': 'قطر', '+968': 'عُمان', '+973': 'البحرين', '+962': 'الأردن',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddPatientModal({ onClose }: AddPatientModalProps) {
  const [form, setForm] = useState<FormState>({
    fullName: '', email: '', password: '', phone: '',
    gender: 'male', age: '', height: '', weight: '',
    country: 'مصر', role: 'patient',
  });
  const [countryCode, setCountryCode] = useState('+20');
  const [success, setSuccess] = useState(false);

  const { mutate: createUser, isPending, error } = useCreateUser();

  let errorMessages: string[] = [];
  if (error) {
    const apiError = error as any;
    if (apiError?.response?.data?.message) {
      const msg = apiError.response.data.message;
      errorMessages = Array.isArray(msg) ? msg : [msg];
    } else {
      errorMessages = ['حدث خطأ. تحقق من البيانات وحاول مجدداً.'];
    }
  }

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
      phone: form.phone.startsWith('+') ? form.phone : `${countryCode}${form.phone}`,
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
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" placeholder="الاسم الكامل *"
                value={form.fullName} onChange={setField('fullName')} disabled={isPending} required />
            </div>
            
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="email" className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" placeholder="البريد الإلكتروني *"
                value={form.email} onChange={setField('email')} disabled={isPending} required />
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="password" className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" placeholder="كلمة المرور *"
                value={form.password} onChange={setField('password')} disabled={isPending} required />
            </div>

            <div className="relative flex items-center bg-secondary rounded-2xl transition-all disabled:opacity-50 focus-within:ring-2 focus-within:ring-primary">
              <Phone className="absolute right-4 w-5 h-5 text-muted-foreground z-10" />
              <select value={countryCode} onChange={(e) => { setCountryCode(e.target.value); setForm(f => ({ ...f, country: codeToCountry[e.target.value] || '' })); }} disabled={isPending} style={{ direction: 'ltr' }} className="pr-12 pl-2 py-4 bg-transparent border-none outline-none cursor-pointer text-sm font-bold z-10 w-28">
                <option value="+966">🇸🇦 +966</option><option value="+20">🇪🇬 +20</option><option value="+971">🇦🇪 +971</option><option value="+965">🇰🇼 +965</option>
                <option value="+974">🇶🇦 +974</option><option value="+968">🇴🇲 +968</option><option value="+973">🇧🇭 +973</option><option value="+962">🇯🇴 +962</option>
              </select>
              <input type="tel" className="flex-1 px-4 py-4 bg-transparent border-none outline-none w-full" placeholder="رقم الجوال *"
                value={form.phone} onChange={setField('phone')} disabled={isPending} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="number" className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" placeholder="العمر"
                  value={form.age} onChange={setField('age')} disabled={isPending} />
              </div>
              <select className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" value={form.gender} onChange={setField('gender')} disabled={isPending}>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="number" className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" placeholder="الوزن (كجم)"
                  value={form.weight} onChange={setField('weight')} disabled={isPending} />
              </div>
              <div className="relative">
                <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="number" className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" placeholder="الطول (سم)"
                  value={form.height} onChange={setField('height')} disabled={isPending} />
              </div>
            </div>

            <div className="relative">
              <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" value={form.role} onChange={setField('role')} disabled={isPending}>
                <option value="patient">مريض</option>
                <option value="doctor">طبيب</option>
                <option value="admin">مسؤول</option>
              </select>
            </div>
          </div>

          {errorMessages.length > 0 && (
            <div className="bg-red-50 text-red-600 rounded-2xl p-4 text-sm border border-red-100">
              <ul className="list-disc list-inside space-y-1" dir="ltr">
                {errorMessages.map((msg, i) => (
                  <li key={i} className="text-right" dir="rtl">{msg}</li>
                ))}
              </ul>
            </div>
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