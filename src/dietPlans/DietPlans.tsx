import { motion } from 'motion/react';
import { Apple, Loader2, Sparkles } from 'lucide-react';
import { useMyPlans } from './hooks/usePlans';

export default function DietPlans() {
  const { data: userPlans, isLoading } = useMyPlans();

  const mapPlanType = (t: string) => {
    if (t === 'weight_loss') return 'إنقاص الوزن';
    if (t === 'weight_gain') return 'زيادة الوزن';
    if (t === 'healthy') return 'نمط حياة صحي';
    return t || 'مخصص';
  };

  const formatPlan = (apiPlan: any) => {
    return {
      id: apiPlan._id || apiPlan.id,
      name: apiPlan.name || apiPlan.title || 'خطتك المخصصة',
      calories: apiPlan.calories?.from ? `${apiPlan.calories.from} - ${apiPlan.calories.to} سعر` : (apiPlan.totalCalories ? `${apiPlan.totalCalories} سعر` : 'غير محدد'),
      type: mapPlanType(apiPlan.type),
      duration: apiPlan.durationInWeeks ? `${apiPlan.durationInWeeks} أسبوع` : 'مستمر',
      startDate: apiPlan.createdAt ? new Date(apiPlan.createdAt).toLocaleDateString('ar-EG') : 'اليوم',
      macros: {
        protein: apiPlan.macros?.protein || 30,
        carbs: apiPlan.macros?.carbs || 45,
        fats: apiPlan.macros?.fats || 25
      },
      meals: apiPlan.meals?.length ? apiPlan.meals.map((m: any) => ({
        meal: m.name || 'وجبة',
        time: m.mealTime || m.time || '-',
        items: m.description ? [m.description] : (m.items || []),
        calories: m.calories || 0,
        icon: Apple,
      })) : [],
      guidelines: apiPlan.instructions ? [apiPlan.instructions] : (apiPlan.description ? [apiPlan.description] : [
        'شرب 8 أكواب ماء يومياً على الأقل',
        'تجنب السكريات المصنعة',
        'تسجيل الوجبات يومياً'
      ])
    };
  };

  const plansList = userPlans?.length ? userPlans.map(formatPlan) : [];

  return (
    <div className="p-6 md:p-8 pb-12 space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            خطتك الغذائية المخصصة
          </h1>
          <p className="text-muted-foreground text-lg">صُممت خصيصاً لتحقيق أهدافك الصحية</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : plansList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-primary/10 shadow-lg">
          <Apple className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">لا توجد خطط غذائية حالياً</h2>
          <p className="text-muted-foreground">تواصل مع طبيبك لتعيين خطة مناسبة لك.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {plansList.map((plan, index) => (
            <motion.div
              key={plan.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-8 pb-12 border-b-2 border-primary/10 last:border-0"
            >
              {/* Header Info */}
              <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg flex flex-col md:flex-row items-center gap-6">
                <div className="p-6 bg-gradient-to-br from-primary to-accent rounded-full">
                  <Apple className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-muted-foreground text-lg mb-4">{plan.type} • {plan.calories}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-4 py-2 bg-secondary rounded-xl text-sm font-bold text-primary">المدة: {plan.duration}</span>
                    <span className="px-4 py-2 bg-secondary rounded-xl text-sm font-bold text-primary">تاريخ البدء: {plan.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Meals */}
                <div className="bg-white border border-primary/10 rounded-3xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
                    <Apple className="w-6 h-6" /> الوجبات اليومية
                  </h3>
                  <div className="space-y-4">
                    {plan.meals.map((meal: any, idx: number) => {
                      const MealIcon = meal.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-secondary/30 rounded-2xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white shadow-sm rounded-2xl">
                                <MealIcon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold">{meal.meal}</h4>
                                <p className="text-sm text-muted-foreground">{meal.time}</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-muted-foreground">السعرات</p>
                              <p className="text-lg font-bold text-primary">{meal.calories}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {meal.items.map((item: string, i: number) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{item}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Macros and Guidelines */}
                <div className="space-y-8">
                  <div className="bg-white border border-primary/10 rounded-3xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-primary">ملخص المغذيات</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-secondary/30 rounded-2xl p-4">
                        <p className="text-3xl font-bold text-primary mb-1">{plan.macros.protein}%</p>
                        <p className="text-sm text-muted-foreground font-semibold">بروتين</p>
                      </div>
                      <div className="bg-secondary/30 rounded-2xl p-4">
                        <p className="text-3xl font-bold text-accent mb-1">{plan.macros.carbs}%</p>
                        <p className="text-sm text-muted-foreground font-semibold">كربوهيدرات</p>
                      </div>
                      <div className="bg-secondary/30 rounded-2xl p-4">
                        <p className="text-3xl font-bold text-[#EAB308] mb-1">{plan.macros.fats}%</p>
                        <p className="text-sm text-muted-foreground font-semibold">دهون</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-primary/10 rounded-3xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-accent">
                      <Sparkles className="w-6 h-6" /> إرشادات مهمة
                    </h3>
                    <div className="space-y-3">
                      {plan.guidelines.map((guideline: string, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-secondary/30 rounded-2xl"
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                          </div>
                          <p className="text-sm font-semibold">{guideline}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
