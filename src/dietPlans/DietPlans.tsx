import { motion, AnimatePresence } from 'motion/react';
import { TrendingDown, TrendingUp, Heart, Sparkles, Lock, Crown, Apple, Salad, Coffee, X, Eye } from 'lucide-react';
import { useState } from 'react';

interface DietPlansProps {
  onPremiumAction: (action: () => void) => void;
  isPremium: boolean;
}

export default function DietPlans({ onPremiumAction, isPremium }: DietPlansProps) {
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const currentPlan = {
    name: 'خطة إنقاص الوزن - أساسية',
    calories: '1500-1800',
    type: 'إنقاص وزن',
    duration: '3 أشهر',
    progress: 75,
    startDate: '1 يناير 2025',
    macros: {
      protein: 30,
      carbs: 45,
      fats: 25
    },
    meals: [
      {
        meal: 'الإفطار',
        time: '8:00 صباحاً',
        items: ['شوفان بالفواكه والعسل', '2 بيض مسلوق', 'عصير برتقال طبيعي'],
        calories: 450,
        icon: Coffee,
      },
      {
        meal: 'سناك صباحي',
        time: '10:30 صباحاً',
        items: ['حفنة من المكسرات', 'تفاحة'],
        calories: 200,
        icon: Apple,
      },
      {
        meal: 'الغداء',
        time: '1:00 ظهراً',
        items: ['صدر دجاج مشوي 150 جم', 'أرز بني كوب', 'سلطة خضراء كبيرة', 'خضار مشوية'],
        calories: 650,
        icon: Apple,
      },
      {
        meal: 'سناك بعد الظهر',
        time: '4:00 مساءً',
        items: ['زبادي يوناني', 'ملعقة عسل'],
        calories: 150,
        icon: Apple,
      },
      {
        meal: 'العشاء',
        time: '7:00 مساءً',
        items: ['سلمون مشوي 120 جم', 'كينوا نصف كوب', 'سلطة سيزر'],
        calories: 550,
        icon: Salad,
      },
    ],
    guidelines: [
      'شرب 8 أكواب ماء يومياً على الأقل',
      'تجنب السكريات المصنعة',
      'ممارسة الرياضة 3 مرات أسبوعياً',
      'النوم 7-8 ساعات يومياً',
      'تسجيل الوجبات يومياً'
    ]
  };
  const categories = [
    {
      id: 'weight-loss',
      title: 'إنقاص الوزن',
      description: 'خطط غذائية متوازنة لفقدان الوزن بشكل صحي',
      icon: TrendingDown,
      gradient: 'from-primary to-accent',
      plans: [
        { name: 'خطة منخفضة السعرات', calories: '1500-1800', premium: false },
        { name: 'خطة الكيتو', calories: '1600-1900', premium: true },
        { name: 'خطة الصيام المتقطع', calories: '1400-1700', premium: true },
      ],
    },
    {
      id: 'weight-gain',
      title: 'زيادة الوزن',
      description: 'برامج غنية بالبروتين لبناء العضلات',
      icon: TrendingUp,
      gradient: 'from-accent to-primary',
      plans: [
        { name: 'خطة بناء العضلات', calories: '2800-3200', premium: true },
        { name: 'خطة زيادة الوزن الصحي', calories: '2500-2800', premium: false },
        { name: 'خطة الرياضيين', calories: '3000-3500', premium: true },
      ],
    },
    {
      id: 'healthy',
      title: 'نمط حياة صحي',
      description: 'توازن مثالي للحفاظ على صحتك',
      icon: Heart,
      gradient: 'from-primary via-accent to-primary',
      plans: [
        { name: 'خطة البحر المتوسط', calories: '2000-2300', premium: false },
        { name: 'خطة نباتية متوازنة', calories: '1900-2200', premium: true },
        { name: 'خطة الطاقة والنشاط', calories: '2100-2400', premium: true },
      ],
    },
  ];

  const sampleMeals = [
    {
      meal: 'الإفطار',
      time: '8:00 صباحاً',
      items: ['شوفان بالفواكه', 'بيض مسلوق', 'عصير برتقال طبيعي'],
      calories: 450,
      icon: Coffee,
    },
    {
      meal: 'الغداء',
      time: '1:00 ظهراً',
      items: ['صدر دجاج مشوي', 'أرز بني', 'سلطة خضراء', 'خضار مشوية'],
      calories: 650,
      icon: Apple,
    },
    {
      meal: 'العشاء',
      time: '7:00 مساءً',
      items: ['سلمون مشوي', 'كينوا', 'سلطة سيزر'],
      calories: 550,
      icon: Salad,
    },
  ];

  return (
    <div className="p-6 md:p-8 pb-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            الخطط الغذائية
          </h1>
          <p className="text-muted-foreground text-lg">اختر الخطة المناسبة لأهدافك</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary rounded-[3rem] p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-3xl">
              <Apple className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">خطتك الحالية</h2>
                <Crown className="w-6 h-6" />
              </div>
              <p className="text-white/90 text-lg">{currentPlan.name}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedPlan(currentPlan);
              setShowPlanDetails(true);
            }}
            className="px-6 py-3 bg-white text-primary rounded-full font-bold flex items-center gap-2 shadow-lg"
          >
            <Eye className="w-5 h-5" />
            <span>عرض التفاصيل</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
            <p className="text-white/80 text-sm mb-1">السعرات اليومية</p>
            <p className="text-2xl font-bold">{currentPlan.calories}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
            <p className="text-white/80 text-sm mb-1">المدة</p>
            <p className="text-2xl font-bold">{currentPlan.duration}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
            <p className="text-white/80 text-sm mb-1">التقدم</p>
            <p className="text-2xl font-bold">{currentPlan.progress}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
            <p className="text-white/80 text-sm mb-1">تاريخ البدء</p>
            <p className="text-lg font-bold">{currentPlan.startDate}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-lg">توزيع المغذيات</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeWidth="8" opacity="0.2" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentPlan.macros.protein / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{currentPlan.macros.protein}%</span>
                </div>
              </div>
              <p className="font-semibold">بروتين</p>
            </div>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeWidth="8" opacity="0.2" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentPlan.macros.carbs / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{currentPlan.macros.carbs}%</span>
                </div>
              </div>
              <p className="font-semibold">كربوهيدرات</p>
            </div>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeWidth="8" opacity="0.2" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentPlan.macros.fats / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{currentPlan.macros.fats}%</span>
                </div>
              </div>
              <p className="font-semibold">دهون</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className={`p-4 bg-gradient-to-br ${category.gradient} rounded-3xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                  <p className="text-muted-foreground text-lg">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.plans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => {
                      if (plan.premium) {
                        onPremiumAction(() => {});
                      }
                    }}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      plan.premium && !isPremium
                        ? 'border-primary/20 bg-white'
                        : 'border-primary/20 bg-white hover:border-primary/40'
                    }`}
                  >
                    {plan.premium && !isPremium && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-br from-primary to-accent rounded-full">
                          <Crown className="w-4 h-4 text-white" />
                          <span className="text-xs font-bold text-white">مميز</span>
                        </div>
                      </div>
                    )}

                    <div className={plan.premium && !isPremium ? 'blur-[2px] pointer-events-none' : ''}>
                      <h3 className="text-xl font-bold mb-2 mt-6">{plan.name}</h3>
                      <p className="text-muted-foreground mb-4">{plan.calories} كالوري</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary font-semibold">عرض التفاصيل</span>
                        {plan.premium && !isPremium ? (
                          <Lock className="w-5 h-5 text-accent" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">مثال على يوم غذائي</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleMeals.map((meal, idx) => {
            const MealIcon = meal.icon;
            return (
              <motion.div
                key={meal.meal}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{meal.meal}</h3>
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl">
                    <MealIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {meal.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">السعرات</span>
                    <span className="font-bold text-primary">{meal.calories} كالوري</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {showPlanDetails && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlanDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-5xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPlanDetails(false)}
                className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                  <Apple className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">{selectedPlan.name}</h2>
                <p className="text-muted-foreground text-lg">{selectedPlan.type}</p>
              </div>

              <div className="space-y-8">
                <div className="bg-primary/5 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">الوجبات اليومية</h3>
                  <div className="space-y-4">
                    {selectedPlan.meals.map((meal: any, idx: number) => {
                      const MealIcon = meal.icon;
                      return (
                        <motion.div
                          key={meal.meal}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary rounded-2xl">
                                <MealIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold">{meal.meal}</h4>
                                <p className="text-sm text-muted-foreground">{meal.time}</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-muted-foreground">السعرات</p>
                              <p className="text-2xl font-bold text-primary">{meal.calories}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {meal.items.map((item: string) => (
                              <div key={item} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-primary/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span>إرشادات مهمة</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPlan.guidelines.map((guideline: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="flex items-start gap-3 p-4 bg-secondary rounded-2xl"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-sm font-semibold">{guideline}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">ملخص المغذيات</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-3 relative">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" fill="none" stroke="#E8F5ED" strokeWidth="8" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="url(#proteinGradient)"
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - selectedPlan.macros.protein / 100)}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#009E2A" />
                              <stop offset="100%" stopColor="#00C236" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{selectedPlan.macros.protein}%</span>
                        </div>
                      </div>
                      <p className="font-bold text-lg">بروتين</p>
                      <p className="text-sm text-muted-foreground">لبناء العضلات</p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-3 relative">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" fill="none" stroke="#E8F5ED" strokeWidth="8" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="url(#carbsGradient)"
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - selectedPlan.macros.carbs / 100)}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="carbsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#009E2A" />
                              <stop offset="100%" stopColor="#00C236" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{selectedPlan.macros.carbs}%</span>
                        </div>
                      </div>
                      <p className="font-bold text-lg">كربوهيدرات</p>
                      <p className="text-sm text-muted-foreground">للطاقة</p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-3 relative">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" fill="none" stroke="#E8F5ED" strokeWidth="8" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="url(#fatsGradient)"
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - selectedPlan.macros.fats / 100)}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="fatsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#009E2A" />
                              <stop offset="100%" stopColor="#00C236" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{selectedPlan.macros.fats}%</span>
                        </div>
                      </div>
                      <p className="font-bold text-lg">دهون</p>
                      <p className="text-sm text-muted-foreground">للصحة العامة</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
