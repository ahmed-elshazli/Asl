import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Plus, Loader2, Edit, Trash2, Power, PowerOff, Building2, Banknote, QrCode } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import { useAllPaymentMethodsAdmin, useTogglePaymentStatus, useDeletePaymentMethod } from '../../hooks/usePaymentMethods';
import type { PaymentMethod } from '../../api/paymentMethodsApi';

interface PaymentMethodsSectionProps {
  onShowAddModal: () => void;
  onShowEditModal: (method: PaymentMethod) => void;
}

export function PaymentMethodsSection({ onShowAddModal, onShowEditModal }: PaymentMethodsSectionProps) {
  const { data: paymentMethods, isLoading } = useAllPaymentMethodsAdmin();
  const { mutate: toggleStatus, isPending: isToggling } = useTogglePaymentStatus();
  const { mutate: deleteMethod, isPending: isDeleting } = useDeletePaymentMethod();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const getMethodIcon = (type: string) => {
    if (type === 'bank_transfer') return <Building2 className="w-6 h-6" />;
    if (type.includes('cash')) return <Banknote className="w-6 h-6" />;
    return <CreditCard className="w-6 h-6" />;
  };

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">طرق الدفع</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            إدارة الحسابات البنكية والمحافظ الإلكترونية
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowAddModal}
          className="px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة طريقة دفع</span>
        </motion.button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-primary">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-lg font-semibold">جاري التحميل...</p>
        </div>
      ) : !paymentMethods || paymentMethods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/10 shadow-sm">
          <CreditCard className="w-16 h-16 text-primary/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد طرق دفع</h3>
          <p className="text-muted-foreground">قم بإضافة طريقة دفع جديدة لتمكين المرضى من الاشتراك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white rounded-3xl p-6 border-2 shadow-sm transition-all relative overflow-hidden group ${
                  method.isActive ? 'border-primary/20 hover:border-primary/50' : 'border-dashed border-muted-foreground/30 opacity-75'
                }`}
              >
                {/* Active Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                  method.isActive ? 'bg-green-100 text-green-700' : 'bg-secondary text-muted-foreground'
                }`}>
                  {method.isActive ? 'نشط' : 'غير نشط'}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    method.isActive ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatType(method.type)}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-secondary/50 p-3 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">اسم الحساب</p>
                    <p className="font-semibold text-sm">{method.accountName}</p>
                  </div>
                  <div className="bg-secondary/50 p-3 rounded-xl border border-border flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">رقم الحساب / المحفظة</p>
                      <p className="font-semibold font-mono text-sm">{method.accountNumber}</p>
                    </div>
                  </div>
                  {method.instructions && (
                    <div className="bg-secondary/50 p-3 rounded-xl border border-border">
                      <p className="text-xs text-muted-foreground mb-1">تعليمات إضافية</p>
                      <p className="font-medium text-sm text-foreground/80 line-clamp-2" title={method.instructions}>
                        {method.instructions}
                      </p>
                    </div>
                  )}
                  {method.qrCode && (
                     <div className="bg-secondary/50 p-3 rounded-xl border border-border flex items-center gap-2 text-sm text-primary">
                       <QrCode className="w-4 h-4" />
                       <span>مرفق QR Code</span>
                     </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => onShowEditModal(method)}
                    className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" /> تعديل
                  </button>
                  <button
                    onClick={() => toggleStatus(method.id)}
                    disabled={isToggling}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium border ${
                      method.isActive 
                        ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
                        : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : (method.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />)}
                    {method.isActive ? 'إيقاف' : 'تفعيل'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(method.id)}
                    disabled={isDeleting}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="حذف طريقة الدفع"
        message="هل أنت متأكد من حذف طريقة الدفع هذه؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        isLoading={isDeleting}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMethod(deleteTarget, {
              onSettled: () => setDeleteTarget(null)
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
