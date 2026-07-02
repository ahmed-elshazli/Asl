import { motion, AnimatePresence } from 'motion/react';
import { X, Apple, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePlanById, useUpdatePlan } from '../hooks/usePlans';
import { PlanForm, DEFAULT_FORM, formToPayload } from './PlanForm';
import type { PlanFormState } from './PlanForm';

interface EditPlanModalProps {
  planId: string;
  onClose: () => void;
}

export function EditPlanModal({ planId, onClose }: EditPlanModalProps) {
  const [form, setForm] = useState<PlanFormState>(DEFAULT_FORM);
  const [success, setSuccess] = useState(false);

  const { data: plan, isLoading } = usePlanById(planId);
  const { mutate: updatePlan, isPending, error } = useUpdatePlan();

  // يملي الـ form بالبيانات الحالية لما تيجي من الـ cache
  useEffect(() => {
    if (!plan) return;
    
    const mapTypeToAr = (type: string) => {
      switch (type) {
        case 'weight_loss': return 'إنقاص الوزن';
        case 'weight_gain': return 'زيادة الوزن';
        case 'healthy': return 'نمط حياة صحي';
        default: return type;
      }
    };

    setForm({
      name:         plan.name || '',
      type:         mapTypeToAr(plan.type || ''),
      caloriesFrom: plan.calories?.from || '',
      caloriesTo:   plan.calories?.to || '',
      duration:     plan.durationInWeeks || '',
      protein:      plan.macros?.protein || '',
      carbs:        plan.macros?.carbs || '',
      fats:         plan.macros?.fats || '',
      meals: plan.meals?.length
        ? plan.meals.map(m => ({
            name: m.name,
            time: m.mealTime || '08:00',
            calories: m.calories || '',
            description: m.description || ''
          }))
        : DEFAULT_FORM.meals,
      guidelines: plan.instructions || '',
    });
  }, [plan]);

  const handleSubmit = () => {
    updatePlan({ 
      id: planId, 
      payload: { 
        ...formToPayload(form), 
        // استخراج الـ ID فقط عشان الباك إند بيرفض الـ Object الكامل
        patient: typeof plan?.patient === 'object' ? (plan.patient as any)._id || (plan.patient as any).id : plan?.patient
      } 
    }, {
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
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">تعديل الخطة الغذائية</h2>
              {plan && <p className="text-sm text-white/70">{plan.name}</p>}
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
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-secondary rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <PlanForm form={form} onChange={setForm} />
          )}
          {error && (
            <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 text-center">
              حدث خطأ أثناء التحديث. حاول مجدداً.
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
            disabled={isPending || success || isLoading}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" />
              : success ? <><CheckCircle2 className="w-5 h-5" /> تم الحفظ!</>
              : <><Save className="w-5 h-5" /> حفظ التعديلات</>}
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
              <h3 className="text-xl font-bold">تم تحديث الخطة بنجاح!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}