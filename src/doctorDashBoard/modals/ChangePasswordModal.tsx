import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useChangePassword } from '../hooks/useDoctorUsers';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChangePasswordModalProps {
  onClose: () => void;
}

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Sub-component: Password Field ───────────────────────────────────────────

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-foreground/60 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '••••••••'}
          className="w-full px-4 py-3 pr-12 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [form, setForm] = useState<FormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { mutate: changePassword, isPending, error } = useChangePassword();

  const set = (key: keyof FormState) => (v: string) => {
    setValidationError('');
    setForm(f => ({ ...f, [key]: v }));
  };

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setValidationError('يرجى ملء جميع الحقول.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setValidationError('كلمتا المرور الجديدتان غير متطابقتين.');
      return;
    }
    if (form.newPassword.length < 8) {
      setValidationError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    changePassword(
      { currentPassword: form.currentPassword, password: form.newPassword, confirmPassword: form.confirmPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(onClose, 1500);
        },
      },
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
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">تغيير كلمة المرور</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <PasswordField label="كلمة المرور الحالية" value={form.currentPassword}
            onChange={set('currentPassword')} placeholder="كلمة مرورك الحالية" />
          <PasswordField label="كلمة المرور الجديدة" value={form.newPassword}
            onChange={set('newPassword')} placeholder="8 أحرف على الأقل" />
          <PasswordField label="تأكيد كلمة المرور الجديدة" value={form.confirmPassword}
            onChange={set('confirmPassword')} placeholder="أعد كتابة كلمة المرور" />

          {(validationError || error) && (
            <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 text-center">
              {validationError || 'كلمة المرور الحالية غير صحيحة. حاول مجدداً.'}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={isPending || success}
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg mt-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" />
              : success ? <><CheckCircle2 className="w-5 h-5" /> تم التغيير بنجاح!</>
              : <><Lock className="w-5 h-5" /> تغيير كلمة المرور</>}
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
              <h3 className="text-xl font-bold">تم تغيير كلمة المرور!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}