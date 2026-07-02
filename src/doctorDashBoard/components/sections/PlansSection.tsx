import { motion, AnimatePresence } from 'motion/react';
import { Plus, Apple, Edit, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAllPlans, useDeletePlan } from '../../hooks/usePlans';
import { useAllUsers } from '../../hooks/useDoctorUsers';
import type { NutritionPlan } from '../../api/plansApi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlansSectionProps {
  onShowAddPlan: () => void;
  onEditPlan: (planId: string) => void;
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({
  planName,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  planName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25 }}
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"
      >
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </motion.div>
      <h3 className="text-xl font-bold mb-2">حذف الخطة</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        هل أنت متأكد من حذف خطة <span className="font-bold text-foreground">"{planName}"</span>؟
      </p>
      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl bg-secondary font-semibold"
        >إلغاء</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          disabled={isDeleting}
          onClick={onConfirm}
          className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          نعم، احذف
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Plan Card ────────────────────────────────────────────────────────────────

const PlanCard = ({
  plan,
  idx,
  patientName,
  onEdit,
  onDelete,
}: {
  plan: NutritionPlan;
  idx: number;
  patientName: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: idx * 0.05 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg flex flex-col"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl flex-shrink-0">
        <Apple className="w-6 h-6 text-white" />
      </div>
      <div className="flex gap-2">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"
        >
          <Edit className="w-4 h-4 text-primary" />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </motion.button>
      </div>
    </div>

    <div className="flex items-center gap-2 mb-1">
      <h3 className="font-bold text-lg">{plan.name}</h3>
      {plan.patient && (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
          {patientName || 'مخصصة لمريض'}
        </span>
      )}
    </div>
    <p className="text-sm text-muted-foreground mb-4 flex-1">{plan.type}</p>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">السعرات</span>
        <span className="font-bold">{plan.calories?.from || 0}–{plan.calories?.to || 0} كالوري</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">المدة</span>
        <span className="font-bold">{plan.durationInWeeks} أسبوع</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>بروتين {plan.macros?.protein || 0}%</span>
        <span>كارب {plan.macros?.carbs || 0}%</span>
        <span>دهون {plan.macros?.fats || 0}%</span>
      </div>
    </div>
  </motion.div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PlanSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg space-y-4 animate-pulse">
    <div className="flex justify-between">
      <div className="w-12 h-12 rounded-2xl bg-secondary" />
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary" />
        <div className="w-8 h-8 rounded-full bg-secondary" />
      </div>
    </div>
    <div className="w-3/4 h-5 bg-secondary rounded-full" />
    <div className="w-1/2 h-4 bg-secondary rounded-full" />
    <div className="space-y-2">
      <div className="w-full h-4 bg-secondary rounded-full" />
      <div className="w-full h-4 bg-secondary rounded-full" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function PlansSection({ onShowAddPlan, onEditPlan }: PlansSectionProps) {
  const [deletingPlan, setDeletingPlan] = useState<NutritionPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: plansResponse, isLoading: isLoadingPlans } = useAllPlans();
  const { data: usersResponse, isLoading: isLoadingUsers } = useAllUsers(1, 1000); // Fetch enough users for mapping
  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan();

  const isLoading = isLoadingPlans || isLoadingUsers;
  const plans = plansResponse?.data ?? [];
  const users = usersResponse?.data ?? [];

  const getPatientName = (patientId: any) => {
    if (!patientId) return null;
    const idStr = typeof patientId === 'object' ? (patientId._id || patientId.id) : patientId;
    const user = users.find((u: any) => (u._id || u.id) === idStr);
    return user ? (user.fullName || (user as any).name) : null;
  };

  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return plans;
    const lowerQuery = searchQuery.toLowerCase();
    return plans.filter(plan => {
      const pName = getPatientName(plan.patient)?.toLowerCase() || '';
      return (
        plan.name?.toLowerCase().includes(lowerQuery) || 
        plan.type?.toLowerCase().includes(lowerQuery) ||
        pName.includes(lowerQuery)
      );
    });
  }, [plans, searchQuery, users]);

  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
    deletePlan(deletingPlan.id, {
      onSuccess: () => setDeletingPlan(null),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">الخطط الغذائية</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            {isLoading ? 'جاري التحميل...' : `${plans.length} خطة غذائية`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث في الخطط..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-full bg-secondary/50 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onShowAddPlan}
            className="px-4 md:px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg text-sm md:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>خطة جديدة</span>
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <PlanSkeleton key={i} />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Apple className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-semibold">لا توجد خطط غذائية حالياً</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onShowAddPlan}
            className="mt-4 px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold shadow-lg"
          >
            أنشئ أول خطة
          </motion.button>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-semibold">لا توجد نتائج بحث مطابقة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, idx) => (
              <PlanCard
                key={plan.id || plan.name}
                plan={plan}
                idx={idx}
                patientName={getPatientName(plan.patient)}
                onEdit={() => onEditPlan(plan.id)}
                onDelete={() => setDeletingPlan(plan)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {deletingPlan && (
          <DeleteConfirm
            planName={deletingPlan.name}
            isDeleting={isDeleting}
            onCancel={() => setDeletingPlan(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}