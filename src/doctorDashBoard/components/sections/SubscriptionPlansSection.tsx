import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Power, AlertCircle, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import {
  useSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useToggleSubscriptionPlanStatus
} from '../../hooks/useSubscriptionPlans';
import type { SubscriptionPlan, CreateSubscriptionPlanPayload } from '../../api/subscriptionPlansApi';
import ConfirmModal from '../../../components/ConfirmModal';

export default function SubscriptionPlansSection() {
  const { data: plansData, isLoading, isError, error } = useSubscriptionPlans();
  
  // حماية إضافية في حالة كان الباك إند يرجع البيانات بصيغة مختلفة
  const rawPlans = plansData?.data || plansData || [];
  const plans = Array.isArray(rawPlans) ? rawPlans : (rawPlans.data || []);
  
  console.log("Subscription Plans Data:", plansData);
  console.log("Parsed Plans Array:", plans);

  const { mutate: createPlan, isPending: isCreating } = useCreateSubscriptionPlan();
  const { mutate: updatePlan, isPending: isUpdating } = useUpdateSubscriptionPlan();
  const { mutate: deletePlan, isPending: isDeleting } = useDeleteSubscriptionPlan();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { mutate: toggleStatus, isPending: isToggling } = useToggleSubscriptionPlanStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const [formData, setFormData] = useState<CreateSubscriptionPlanPayload>({
    name: '',
    description: '',
    price: 0,
    durationInDays: 30,
    billingCycle: 'monthly',
    isPopular: false,
    features: []
  });
  const [featuresInput, setFeaturesInput] = useState('');

  const handleOpenModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || 0,
        durationInDays: plan.durationInDays || 30,
        billingCycle: plan.billingCycle || 'monthly',
        isPopular: plan.isPopular || false,
        features: plan.features || []
      });
      setFeaturesInput(plan.features?.join('\\n') || '');
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        durationInDays: 30,
        billingCycle: 'monthly',
        isPopular: false,
        features: []
      });
      setFeaturesInput('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featuresInput.split('\\n').map(f => f.trim()).filter(f => f.length > 0);
    const payload = { ...formData, features: featuresList };

    if (editingPlan) {
      updatePlan({ id: editingPlan._id || editingPlan.id, payload }, {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: (err: any) => {
          console.error(err.response?.data);
          alert(err.response?.data?.message || 'حدث خطأ أثناء التحديث');
        }
      });
    } else {
      createPlan(payload, {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: (err: any) => {
          console.error(err.response?.data);
          alert(err.response?.data?.message || 'حدث خطأ أثناء الإضافة');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    console.error("Subscription Plans Error:", error);
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-8 bg-destructive/5 rounded-3xl">
        <AlertCircle className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold mb-2">حدث خطأ</h3>
        <p className="text-center">لم نتمكن من جلب بيانات الاشتراكات. {(error as any)?.message || 'تأكد من اتصالك بالإنترنت.'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground flex items-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              باقات الاشتراك
            </h1>
            <p className="text-muted-foreground">إدارة وعرض باقات الاشتراك المتاحة للمرضى</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-2xl transition-all shadow-lg shadow-primary/25 font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">إضافة باقة جديدة</span>
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center p-12 bg-secondary/50 rounded-3xl border border-border">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد باقات حالياً</h3>
            <p className="text-muted-foreground">قم بإضافة باقة اشتراك جديدة للبدء.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: any) => {
              if (!plan || typeof plan !== 'object') return null;
              return (
              <motion.div
                key={plan._id || plan.id || Math.random()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all relative overflow-hidden ${plan.isActive ? 'border-primary/20 hover:border-primary/50' : 'border-border opacity-75'}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-4 left-[-35px] -rotate-45 bg-accent text-white text-[10px] font-bold py-1 px-10 shadow-md">
                    الأكثر طلباً
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-foreground">{plan.name || 'بدون اسم'}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
                    {plan.isActive ? (
                      <><CheckCircle2 className="w-3 h-3" /> نشط</>
                    ) : (
                      <><Power className="w-3 h-3" /> متوقف</>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">{plan.price || 0}</span>
                  <span className="text-muted-foreground text-sm mr-1">{plan.currency || 'جنيه'}</span>
                  {plan.billingCycle && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      {plan.billingCycle === 'monthly' ? 'شهرياً' : plan.billingCycle === 'yearly' ? 'سنوياً' : plan.billingCycle}
                    </span>
                  )}
                </div>
                
                {plan.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>
                )}

                <div className="mb-6 space-y-2">
                  {plan.durationInDays && (
                    <p className="text-sm font-bold text-foreground">المدة: {plan.durationInDays} يوم</p>
                  )}
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {Array.isArray(plan.features) && plan.features.slice(0, 3).map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                    {Array.isArray(plan.features) && plan.features.length > 3 && (
                      <li className="text-xs text-primary/70 font-medium pt-1">
                        + {plan.features.length - 3} مميزات أخرى
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border mt-auto">
                  <button
                    onClick={() => handleOpenModal(plan)}
                    className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> تعديل
                  </button>
                  <button
                    onClick={() => toggleStatus(plan._id || plan.id)}
                    disabled={isToggling}
                    className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Power className="w-4 h-4" /> {plan.isActive ? 'إيقاف' : 'تفعيل'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(plan._id || plan.id)}
                    disabled={isDeleting}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex items-center justify-center"
                    title="حذف الباقة"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {editingPlan ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">اسم الباقة</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary"
                    placeholder="مثال: الخطة الذهبية"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">السعر</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">المدة (بالأيام)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.durationInDays || 30}
                      onChange={(e) => setFormData({ ...formData, durationInDays: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">دورة الدفع</label>
                    <select
                      value={formData.billingCycle || 'monthly'}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="monthly">شهرياً (Monthly)</option>
                      <option value="yearly">سنوياً (Yearly)</option>
                      <option value="weekly">أسبوعياً (Weekly)</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPopular || false}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-muted-foreground">باقة أكثر طلباً (Popular)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">الوصف (اختياري)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    placeholder="وصف مختصر للباقة..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">المميزات (كل ميزة في سطر)</label>
                  <textarea
                    required
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                    placeholder="متابعة أسبوعية&#10;نظام غذائي مخصص&#10;تواصل مباشر"
                  />
                </div>

                <div className="flex gap-3 pt-4 mt-8">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors flex items-center justify-center"
                  >
                    {(isCreating || isUpdating) ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ الباقة'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="حذف الباقة"
        message="هل أنت متأكد من حذف هذه الباقة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        isLoading={isDeleting}
        onConfirm={() => {
          if (deleteTarget) {
            deletePlan(deleteTarget, {
              onSettled: () => setDeleteTarget(null)
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
