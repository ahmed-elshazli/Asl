import { motion } from 'motion/react';
import {
  Crown, Sparkles, Loader2, Clock, XCircle, Ban, AlertTriangle,
  CreditCard, Phone, Image, CheckCircle2, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { useSubscriptionPlans } from '../doctorDashBoard/hooks/useSubscriptionPlans';
import { useMyCurrentSubscription } from '../doctorDashBoard/hooks/useSubscriptions';
import { CheckoutModal } from './components/CheckoutModal';

interface SubscriptionProps {
  onProtectedAction: (action: () => void) => void;
  isAuthenticated: boolean;
  isPremium: boolean;
  onSubscribe: () => void;
}

export default function Subscription({ isAuthenticated, onProtectedAction, isPremium, onSubscribe }: SubscriptionProps) {
  const { data: plansData, isLoading: plansLoading, isError } = useSubscriptionPlans();
  const { data: currentSub, isLoading: subLoading }            = useMyCurrentSubscription(isAuthenticated);

  const rawPlans    = plansData?.data || plansData || [];
  const apiPlans    = Array.isArray(rawPlans) ? rawPlans : (rawPlans as any).data || [];
  const activePlans = apiPlans
    .filter((p: any) => p.isActive)
    .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const subStatus = currentSub?.status;
  const isLoading = plansLoading || subLoading;

  const [selectedPlan, setSelectedPlan]   = useState<any>(null);
  const [showCheckout, setShowCheckout]   = useState(false);

  const handleSubscribeClick = (plan: any) => {
    onProtectedAction(() => { setSelectedPlan(plan); setShowCheckout(true); });
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
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

  // ─── PENDING ──────────────────────────────────────────────────────────────
  if (subStatus === 'PENDING') {
    const plan          = currentSub?.plan as any;
    const method        = currentSub?.paymentMethod as any;
    const screenshot    = currentSub?.paymentScreenshot;
    const senderNumber  = currentSub?.senderNumber;

    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="inline-flex p-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-6"
            >
              <Clock className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-3">طلبك قيد المراجعة</h1>
            <p className="text-muted-foreground text-lg">
              سيتم مراجعة إيصال الدفع وتفعيل اشتراكك في أقرب وقت ممكن
            </p>
          </div>

          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <span className="flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
              <Clock className="w-4 h-4" />
              في انتظار موافقة الطبيب
            </span>
          </div>

          <div className="space-y-4">
            {/* Plan details */}
            {plan && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-primary to-accent text-white rounded-3xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">الباقة المختارة</p>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      {plan.description && <p className="text-white/70 text-sm mt-1">{plan.description}</p>}
                    </div>
                    <div className="text-left">
                      <p className="text-white/70 text-sm mb-1">القيمة</p>
                      <p className="text-3xl font-black">{plan.price} <span className="text-lg font-normal">{plan.currency || 'EGP'}</span></p>
                      <p className="text-white/70 text-xs mt-1">
                        {plan.billingCycle === 'monthly' ? 'شهرياً' : plan.billingCycle === 'yearly' ? 'سنوياً' : plan.billingCycle}
                        {plan.durationInDays && ` · ${plan.durationInDays} يوم`}
                      </p>
                    </div>
                  </div>
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plan.features.map((f: string, i: number) => (
                        <span key={i} className="text-xs px-3 py-1 bg-white/20 rounded-full">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Payment details */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-border shadow-sm"
            >
              <h4 className="font-bold text-base mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                تفاصيل الدفع
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {method && (
                  <>
                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">وسيلة الدفع</p>
                      <p className="font-bold">{method.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">رقم: {method.accountNumber}</p>
                    </div>
                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">اسم الحساب</p>
                      <p className="font-bold">{method.accountName}</p>
                    </div>
                  </>
                )}
                {senderNumber && (
                  <div className="bg-secondary rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> رقم المرسل
                    </p>
                    <p className="font-bold" dir="ltr">{senderNumber}</p>
                  </div>
                )}
                <div className="bg-secondary rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">تاريخ الطلب</p>
                  <p className="font-bold">
                    {currentSub?.createdAt
                      ? new Date(currentSub.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment screenshot */}
            {screenshot && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-3xl p-6 border border-border shadow-sm"
              >
                <h4 className="font-bold text-base mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  إيصال الدفع
                </h4>
                <div className="relative">
                  <img
                    src={screenshot}
                    alt="إيصال الدفع"
                    className="w-full max-h-64 object-contain rounded-2xl bg-secondary"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <a
                    href={screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline w-fit"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح الإيصال في تبويب جديد
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── REJECTED ─────────────────────────────────────────────────────────────
  if (subStatus === 'REJECTED') {
    const plan         = currentSub?.plan as any;
    const rejectReason = currentSub?.rejectReason || 'لم يتم تحديد سبب';
    const reviewedBy   = (currentSub?.approvedBy as any)?.fullName;

    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="inline-flex p-8 bg-gradient-to-br from-rose-500 to-red-600 rounded-full mb-6"
            >
              <XCircle className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-3">تم رفض طلب الاشتراك</h1>
            {plan && (
              <p className="text-muted-foreground text-lg">
                عذراً، تم رفض طلب اشتراكك في باقة{' '}
                <span className="font-bold text-primary">{plan.name}</span>
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm mb-6">
            <div className="bg-rose-50 rounded-2xl p-6 mb-4">
              <p className="text-sm text-rose-600 font-bold mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> سبب الرفض
              </p>
              <p className="text-foreground text-lg">{rejectReason}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {reviewedBy && (
                <div className="bg-secondary rounded-2xl p-3">
                  <p className="text-muted-foreground mb-1">تمت المراجعة بواسطة</p>
                  <p className="font-bold">{reviewedBy}</p>
                </div>
              )}
              {currentSub?.createdAt && (
                <div className="bg-secondary rounded-2xl p-3">
                  <p className="text-muted-foreground mb-1">تاريخ الطلب</p>
                  <p className="font-bold">
                    {new Date(currentSub.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-muted-foreground mb-8">يمكنك إعادة المحاولة باختيار باقة جديدة أدناه:</p>
        </motion.div>
      </div>
    );
  }

  // ─── ACTIVE ───────────────────────────────────────────────────────────────
  const hasActiveSub = subStatus === 'ACTIVE';
  if (hasActiveSub || isPremium) {
    const plan         = currentSub?.plan as any;
    const planName     = plan?.name || 'عضوية مميزة';
    const planFeatures = plan?.features || [];
    const approvedBy   = (currentSub?.approvedBy as any)?.fullName;
    const endDate      = currentSub?.endDate
      ? new Date(currentSub.endDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'مفتوح الدوام';
    const daysLeft = currentSub?.endDate
      ? Math.ceil((new Date(currentSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="inline-flex p-8 bg-gradient-to-br from-primary to-accent rounded-full mb-8"
          >
            <Crown className="w-20 h-20 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">أنت مشترك مميز!</h1>
          <p className="text-muted-foreground text-xl mb-12">استمتع بجميع الميزات الحصرية</p>

          <div className="bg-white rounded-[3rem] p-10 border border-primary/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-5 text-right">
                <p className="text-sm text-muted-foreground mb-1">الخطة الحالية</p>
                <p className="text-xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  {planName}
                </p>
                {plan?.price && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.price} {plan.currency || 'EGP'}
                  </p>
                )}
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-5 text-right">
                <p className="text-sm text-muted-foreground mb-1">تاريخ الانتهاء</p>
                <p className="text-lg font-bold text-primary">{endDate}</p>
                {daysLeft !== null && (
                  <p className={`text-sm mt-1 font-medium ${daysLeft <= 7 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {daysLeft > 0 ? `متبقي ${daysLeft} يوم` : 'ينتهي اليوم'}
                  </p>
                )}
              </div>
              {approvedBy && (
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-5 text-right">
                  <p className="text-sm text-muted-foreground mb-1">تم التفعيل بواسطة</p>
                  <p className="text-lg font-bold">{approvedBy}</p>
                </div>
              )}
            </div>

            {planFeatures.length > 0 && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">الميزات المتاحة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {planFeatures.map((feature: string, idx: number) => (
                    <motion.div key={idx}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Plans List (no sub / CANCELLED / EXPIRED) ────────────────────────────
  const lapsedStatus   = subStatus === 'CANCELLED' || subStatus === 'EXPIRED' ? subStatus : null;
  const lapsedPlanName = (currentSub?.plan as any)?.name;

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Lapsed banner */}
        {lapsedStatus && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
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
                ? <>كنت مشتركاً في باقة <span className="font-bold">{lapsedPlanName}</span>. اختر باقة جديدة للاستمرار.</>
                : 'اختر باقة جديدة للاستمرار في الاستفادة من كل الميزات.'}
            </p>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
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

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {activePlans.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-white rounded-3xl border-2 border-dashed border-primary/20">
              <p className="text-xl font-bold text-muted-foreground">لا توجد باقات متاحة حالياً</p>
            </div>
          ) : activePlans.map((plan: any, idx: number) => {
            const isPremiumPlan = plan.isPopular;
            return (
              <motion.div
                key={plan._id || plan.id || plan.name}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -10 }}
                className={`relative p-8 rounded-[3rem] ${isPremiumPlan ? 'bg-primary text-white shadow-2xl' : 'bg-white border-2 border-primary/20 shadow-lg'}`}
              >
                {isPremiumPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-6 py-2 bg-accent rounded-full text-white font-bold text-sm shadow-lg flex items-center gap-2 whitespace-nowrap">
                      <Sparkles className="w-4 h-4" />الأكثر طلبًا
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-4 ${!isPremiumPlan && 'text-primary'}`}>{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold">{plan.price || 0}</span>
                    <span className="text-2xl">{plan.currency || 'EGP'}</span>
                  </div>
                  <p className={`text-base ${isPremiumPlan ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {plan.billingCycle === 'yearly' ? 'سنوياً' : plan.billingCycle === 'monthly' ? 'شهرياً' : plan.billingCycle}
                    {plan.durationInDays && <span className="mr-2 text-sm opacity-80">({plan.durationInDays} يوم)</span>}
                  </p>
                  {plan.description && (
                    <p className={`mt-2 text-sm ${isPremiumPlan ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.description}</p>
                  )}
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubscribeClick(plan)}
                  className={`w-full py-4 rounded-full font-bold text-lg shadow-lg mb-8 ${isPremiumPlan ? 'bg-white text-primary' : 'bg-gradient-to-br from-primary to-accent text-white'}`}
                >
                  اشترك الآن
                </motion.button>
                <div className="space-y-3">
                  {Array.isArray(plan.features) && plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${isPremiumPlan ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <CheckCircle2 className={`w-4 h-4 ${isPremiumPlan ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <span className={isPremiumPlan ? 'text-white' : 'text-foreground'}>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
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
        onConfirm={() => { setShowCheckout(false); onSubscribe(); }}
      />
    </div>
  );
}