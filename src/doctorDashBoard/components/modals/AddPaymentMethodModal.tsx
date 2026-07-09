import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { useCreatePaymentMethod } from '../../hooks/usePaymentMethods';
import { PaymentMethodType } from '../../api/paymentMethodsApi';

interface AddPaymentMethodModalProps {
  onClose: () => void;
}

export function AddPaymentMethodModal({ onClose }: AddPaymentMethodModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PaymentMethodType>(PaymentMethodType.BANK_TRANSFER);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  // Assuming qrCode is passed as a string url/base64 for now, or just leave it out if it requires multipart
  const [qrCode, setQrCode] = useState('');

  const { mutate: createMethod, isPending } = useCreatePaymentMethod();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMethod(
      {
        name,
        type,
        accountName,
        accountNumber,
        instructions: instructions || undefined,
        qrCode: qrCode || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
      >
        <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-secondary/30">
          <h2 className="text-2xl font-bold">إضافة طريقة دفع</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">اسم الطريقة (للظهور)</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary"
                placeholder="مثال: البنك الأهلي المصري"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">النوع</label>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value as PaymentMethodType)}
                className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value={PaymentMethodType.BANK_TRANSFER}>تحويل بنكي</option>
                <option value={PaymentMethodType.INSTAPAY}>إنستاباي (InstaPay)</option>
                <option value={PaymentMethodType.VODAFONE_CASH}>فودافون كاش</option>
                <option value={PaymentMethodType.ORANGE_CASH}>أورانج كاش</option>
                <option value={PaymentMethodType.ETISALAT_CASH}>اتصالات كاش</option>
                <option value={PaymentMethodType.WE_PAY}>وي باي</option>
                <option value={PaymentMethodType.OTHER}>أخرى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">اسم صاحب الحساب</label>
              <input
                required
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary"
                placeholder="اسم المستفيد"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">رقم الحساب / المحفظة</label>
              <input
                required
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary font-mono text-left"
                placeholder="01xxxxxxxxx أو رقم الحساب"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">تعليمات إضافية (اختياري)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary resize-none h-24"
              placeholder="تعليمات تظهر للمريض عند الدفع..."
            />
          </div>

          {/* For now, just a text input for QR Code link. Modify later if backend uses multipart */}
          <div>
            <label className="block text-sm font-semibold mb-2">رابط QR Code (اختياري)</label>
            <input
              type="text"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-left"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-gradient-to-br from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ وإضافة'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
