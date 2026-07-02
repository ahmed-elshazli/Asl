import { motion, AnimatePresence } from 'motion/react';
import { X, Apple, Trash2, Loader2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { usePlansByClient, useDeletePlan } from '../hooks/usePlans';
import type { NutritionPlan } from '../api/plansApi';

interface UserPlansModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export function UserPlansModal({ userId, userName, onClose }: UserPlansModalProps) {
  const { data: plansResponse, isLoading } = usePlansByClient(userId);
  const { mutate: deletePlan } = useDeletePlan();
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  // استخراج الخطط بناءً على طريقة إرجاع الباك إند
  let plans: NutritionPlan[] = [];
  if (Array.isArray(plansResponse)) {
    plans = plansResponse;
  } else if (plansResponse && typeof plansResponse === 'object') {
    if (Array.isArray((plansResponse as any).data)) {
      plans = (plansResponse as any).data;
    }
  }

  const handleDelete = (planId: string) => {
    setDeletingPlanId(planId);
    deletePlan(planId, {
      onSettled: () => {
        setDeletingPlanId(null);
      }
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
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">الخطط الغذائية</h2>
              <p className="text-sm text-white/70">الخطط المخصصة للمريض {userName}</p>
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
              <p className="font-bold">جاري تحميل الخطط...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Apple className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold text-lg">لا توجد خطط غذائية</p>
              <p className="text-sm">لم يتم تعيين أي خطة غذائية لهذا المريض حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {plans.map((plan) => {
                  const isDeletingPlan = deletingPlanId === (plan.id || (plan as any)._id);
                  
                  return (
                    <motion.div
                      key={plan.id || (plan as any)._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-secondary/50 rounded-2xl p-4 flex items-center justify-between border border-primary/10 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg truncate">
                            {plan.name || (plan as any).title || 'بدون اسم'}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                            {plan.type === 'healthy' ? 'صحي' : plan.type === 'weight-loss' ? 'خسارة وزن' : plan.type === 'muscle-gain' ? 'زيادة عضلات' : plan.type || 'مخصص'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            تاريخ التعيين: {formatDate(plan.createdAt)}
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            السعرات: {plan.calories?.from || 0} - {plan.calories?.to || 0}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        disabled={isDeletingPlan}
                        onClick={() => handleDelete(plan.id || (plan as any)._id)}
                        className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center flex-shrink-0 mr-3 transition-colors disabled:opacity-50"
                        title="حذف الخطة"
                      >
                        {isDeletingPlan ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
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
