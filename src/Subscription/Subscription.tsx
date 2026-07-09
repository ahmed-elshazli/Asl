import { motion } from 'motion/react';
import { Crown, Sparkles, Loader2 } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useSubscriptionPlans } from '../doctorDashBoard/hooks/useSubscriptionPlans';
import { CheckoutModal } from './components/CheckoutModal';

interface SubscriptionProps {
  onProtectedAction: (action: () => void) => void;
  isAuthenticated: boolean;
  isPremium: boolean;
  onSubscribe: () => void;
}

export default function Subscription({ onProtectedAction,  isPremium, onSubscribe }: SubscriptionProps) {
  const { data: plansData, isLoading, isError } = useSubscriptionPlans();
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

  if (isPremium) {
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
                  الاشتراك السنوي
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold mb-2">تاريخ التجديد</h3>
                <p className="text-3xl font-bold text-primary">25 مايو 2027</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">الميزات المتاحة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ title: 'ميزات حصرية', icon: Sparkles }].map((feature: any, idx: number) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center gap-3 text-right"
                    >
                      <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">{feature.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
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

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
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
