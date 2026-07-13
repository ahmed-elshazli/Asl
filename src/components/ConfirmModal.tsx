import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'تأكيد',
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = variant === 'danger'
    ? { bg: 'bg-red-50', icon: 'text-red-500', btn: 'bg-red-500 hover:bg-red-600' }
    : { bg: 'bg-orange-50', icon: 'text-orange-500', btn: 'bg-orange-500 hover:bg-orange-600' };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onCancel}
            className="absolute top-3 left-3 p-1.5 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="p-6 text-center">
            <div className={`inline-flex p-4 ${colors.bg} rounded-full mb-4`}>
              <AlertTriangle className={`w-8 h-8 ${colors.icon}`} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3 p-5 pt-0">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white ${colors.btn} transition-colors disabled:opacity-50`}
            >
              {isLoading ? '...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
