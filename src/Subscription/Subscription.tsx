import { motion } from 'motion/react';
import { Crown, Sparkles, Loader2, Clock, XCircle, Ban, AlertTriangle } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSubscriptionPlans } from '../doctorDashBoard/hooks/useSubscriptionPlans';
import { useMyCurrentSubscription, useCancelMySubscription } from '../doctorDashBoard/hooks/useSubscriptions';
import { CheckoutModal } from './components/CheckoutModal';
import ConfirmModal from '../components/ConfirmModal';

interface SubscriptionProps {
  onProtectedAction: (action: () => void) => void;
  isAuthenticated: boolean;
  isPremium: boolean;
  onSubscribe: () => void;
}

export default function Subscription({ isAuthenticated, onProtectedAction, isPremium, onSubscribe }: SubscriptionProps) {
  const { data: plansData, isLoading: plansLoading, isError } = useSubscriptionPlans();
  const rawPlans = plansData?.data || plansData || [];
  const apiPlans = Array.isArray(rawPlans) ? rawPlans : (rawPlans.data || []);
  const activePlans = apiPlans.filter((p: any) => p.isActive).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSubscribeClick = (plan: any) => {
    onProtectedAction(() => {
      setSelectedPlan(plan);
      setShowCheckout(true);
    });
  };

  const handleCheckoutConfirm = () => {
    setShowCheckout(false);
    onSubscribe();
  };

  const { data: currentSub, isLoading: subLoading } = useMyCurrentSubscription(isAuthenticated);
  const subStatus = currentSub?.status;
  const isLoading = plansLoading || subLoading;

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { mutate: cancelMySubscription, isPending: isCancelling } = useCancelMySubscription();

  const handleCancelConfirm = () => {
    cancelMySubscription(undefined, {
      onSuccess: () => {
        toast.success('تم إلغاء اشتراكك.');
        setShowCancelConfirm(false);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message;
        toast.error(typeof msg === 'string' ? msg : 'حدث خطأ أثناء إلغاء الاشتراك.');
        setShowCancelConfirm(false);
      },
    });
  };

  // ==========================================
  // PENDING status - waiting for doctor approval
  // ==========================================
  if (subStatus === 'PENDING') {
    const planName = (currentSub?.plan as any)?.name || 'الباقة المختارة';
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="inline-flex p-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-8"
          >
            <Clock className="w-20 h-20 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">طلبك قيد المراجعة</h1>
          <p className="text-muted-foreground text-xl mb-12">
            تم إرسال طلب الاشتراك في باقة <span className="font-bold text-primary">{planName}</span> بنجاح
          </p>

          <div className="bg-white rounded-[3rem] p-12 border border-indigo-100 shadow-2xl">
            <div className="bg-indigo-50 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center gap-3 text-indigo-700 mb-4">
                <Clock className="w-6 h-6" />
                <span className="text-xl font-bold">في انتظار موافقة الطبيب</span>
              </div>
              <p className="text-muted-foreground text-lg">
                سيتم مراجعة إيصال الدفع الخاص بك وتفعيل اشتراكك في أقرب وقت ممكن.
                ستتلقى إشعاراً عند الموافقة على طلبك.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-right">
                <h3 className="text-lg font-bold mb-2 text-muted-foreground">الباقة المطلوبة</h3>
                <p className="text-2xl font-bold text-primary">{planName}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold mb-2 text-muted-foreground">تاريخ الطلب</h3>
                <p className="text-2xl font-bold text-foreground">
                  {currentSub?.createdAt
                    ? new Date(currentSub.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // REJECTED status - subscription was rejected
  // ==========================================
  if (subStatus === 'REJECTED') {
    const planName = (currentSub?.plan as any)?.name || 'الباقة المختارة';
    const rejectReason = currentSub?.rejectReason || 'لم يتم تحديد سبب';
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="inline-flex p-8 bg-gradient-to-br from-rose-500 to-red-600 rounded-full mb-8"
          >
            <XCircle className="w-20 h-20 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">تم رفض طلب الاشتراك</h1>
          <p className="text-muted-foreground text-xl mb-12">
            عذراً، تم رفض طلب اشتراكك في باقة <span className="font-bold text-primary">{planName}</span>
          </p>

          <div className="bg-white rounded-[3rem] p-12 border border-rose-100 shadow-2xl mb-12">
            <div className="bg-rose-50 rounded-2xl p-8">
              <div className="flex items-center justify-center gap-3 text-rose-700 mb-4">
                <XCircle className="w-6 h-6" />
                <span className="text-xl font-bold">سبب الرفض</span>
              </div>
              <p className="text-foreground text-lg">{rejectReason}</p>
            </div>
          </div>

          <p className="text-muted-foreground text-lg mb-6">يمكنك إعادة المحاولة باختيار باقة جديدة أدناه:</p>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE status - has active subscription
  // ==========================================
  const hasActiveSub = subStatus === 'ACTIVE';

  if (hasActiveSub || isPremium) {
    const planName = currentSub?.plan ? (currentSub.plan as any).name : 'عضوية مميزة (باقة خاصة)';
    const endDate = currentSub?.endDate
      ? new Date(currentSub.endDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'مفتوح الدوام';
    const planFeatures = (currentSub?.plan as any)?.features || ['دعم على مدار الساعة', 'خطط غذائية وتدريبية مخصصة', 'تواصل مباشر مع الطبيب'];
    const daysLeft = currentSub?.endDate
      ? Math.ceil((new Date(currentSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="inline-flex p-8 bg-gradient-to-br from-primary to-accent rounded-full mb-8"
          >
            <Crown className="w-20 h-20 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">أنت مشترك مميز!</h1>
          <p className="text-muted-foreground text-xl mb-12">استمتع بجميع الميزات الحصرية</p>

          <div className="bg-white rounded-[3rem] p-12 border border-primary/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="text-right">
                <h3 className="text-xl font-bold mb-2">الخطة الحالية</h3>
                <p className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  {planName}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold mb-2">تاريخ الانتهاء</h3>
                <p className="text-3xl font-bold text-primary">{endDate}</p>
                {daysLeft !== null && (
                  <p className={`text-sm mt-1 font-medium ${daysLeft <= 7 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    (متبقي {daysLeft} يوم)
                  </p>
                )}
              </div>
            </div>

            {planFeatures.length > 0 && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">الميزات المتاحة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {planFeatures.map((feature: string, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center gap-3 text-right"
                    >
                      <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {hasActiveSub && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="mt-8 text-sm text-muted-foreground hover:text-destructive underline underline-offset-4 transition-colors"
            >
              إلغاء الاشتراك
            </button>
          )}
        </motion.div>

        <ConfirmModal
          isOpen={showCancelConfirm}
          title="إلغاء الاشتراك"
          message={`هل أنت متأكد من إلغاء اشتراكك في باقة "${planName}"؟ هتفقد وصولك للميزات المميزة فورًا.`}
          confirmText="إلغاء الاشتراك"
          cancelText="تراجع"
          isLoading={isCancelling}
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowCancelConfirm(false)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h3 className="text-xl font-bold mb-2 text-destructive">عذراً، حدث خطأ أثناء تحميل الباقات</h3>
        <p className="text-muted-foreground">الرجاء المحاولة مرة أخرى لاحقاً</p>
      </div>
    );
  }

  const lapsedStatus = subStatus === 'CANCELLED' || subStatus === 'EXPIRED' ? subStatus : null;
  const lapsedPlanName = (currentSub?.plan as any)?.name;

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {lapsedStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center"
          >
            <div className="inline-flex p-3 bg-amber-100 rounded-full mb-3">
              {lapsedStatus === 'CANCELLED'
                ? <Ban className="w-6 h-6 text-amber-600" />
                : <AlertTriangle className="w-6 h-6 text-amber-600" />}
            </div>
            <h3 className="text-lg font-bold text-amber-900 mb-1">
              {lapsedStatus === 'CANCELLED' ? 'تم إلغاء اشتراكك السابق' : 'انتهى اشتراكك السابق'}
            </h3>
            <p className="text-sm text-amber-700">
              {lapsedPlanName
                ? <>كنت مشتركاً في باقة <span className="font-bold">{lapsedPlanName}</span>. اختر باقة جديدة للاستمرار في الاستفادة من كل الميزات.</>
                : 'اختر باقة جديدة للاستمرار في الاستفادة من كل الميزات.'}
            </p>
          </motion.div>
        )}

        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-6"
          >
            <Crown className="w-16 h-16 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-4">
            انضم للمميزين
          </h1>
          <p className="text-muted-foreground text-xl">احصل على تجربة صحية متكاملة ومخصصة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {activePlans.length === 0 && (
            <div className="col-span-full text-center p-12 bg-white rounded-3xl border-2 border-dashed border-primary/20">
              <p className="text-xl font-bold text-muted-foreground">لا توجد باقات متاحة حالياً</p>
            </div>
          )}
          {activePlans.map((plan: any, idx: number) => {
            const isPremiumPlan = plan.isPopular;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -10 }}
                className={`relative p-8 rounded-[3rem] ${
                  isPremiumPlan
                    ? `bg-primary text-white shadow-2xl`
                    : `bg-white border-2 border-primary/20 shadow-lg`
                }`}
              >
                {isPremiumPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-6 py-2 bg-accent rounded-full text-white font-bold text-sm shadow-lg flex items-center gap-2 whitespace-nowrap">
                      <Sparkles className="w-4 h-4" />
                      <span>الأكثر طلبًا</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-4 ${!isPremiumPlan && 'text-primary'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold">{plan.price || 0}</span>
                    <span className="text-2xl">{plan.currency || 'ر.س'}</span>
                  </div>
                  <p className={`text-lg ${isPremiumPlan ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {plan.billingCycle === 'yearly' ? 'سنوياً' : plan.billingCycle === 'monthly' ? 'شهرياً' : plan.billingCycle}
                    {plan.durationInDays && <span className="mr-2 text-sm opacity-80">({plan.durationInDays} يوم)</span>}
                  </p>
                  {plan.description && (
                    <div className="inline-block mt-3 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-2xl text-sm">
                      <span className="font-bold">{plan.description}</span>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubscribeClick(plan)}
                  className={`w-full py-4 rounded-full font-bold text-lg shadow-lg mb-8 ${
                    isPremiumPlan
                      ? 'bg-white text-primary hover:shadow-2xl'
                      : 'bg-gradient-to-br from-primary to-accent text-white'
                  }`}
                >
                  اشترك الآن
                </motion.button>

                <div className="space-y-4">
                  {Array.isArray(plan.features) && plan.features.map((featureText: string, featureIdx: number) => {
                    return (
                      <motion.div
                        key={featureIdx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + featureIdx * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`p-1.5 rounded-lg ${
                          isPremiumPlan ? 'bg-white/20' : 'bg-primary/10'
                        }`}>
                          <CheckCircle2 className={`w-4 h-4 ${isPremiumPlan ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <span className={isPremiumPlan ? 'text-white' : 'text-foreground'}>
                          {featureText}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[3rem] p-12 text-center border border-primary/10 shadow-lg"
        >
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">ضمان استرداد المبلغ</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            إذا لم تكن راضياً تماماً عن الخدمة خلال أول 30 يوماً، سنعيد لك المبلغ كاملاً دون أي أسئلة
          </p>
        </motion.div>
      </motion.div>

      <CheckoutModal
        isOpen={showCheckout}
        plan={selectedPlan}
        onClose={() => setShowCheckout(false)}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
}
