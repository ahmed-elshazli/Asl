import { motion } from 'motion/react';
import { Sparkles, Crown, TrendingUp, Award, Apple, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HomeProps {
  onProtectedAction: (action: () => void) => void;
  onPremiumAction: (action: () => void) => void;
  isAuthenticated: boolean;
  isPremium: boolean;
}

export function Home({  onPremiumAction,  isPremium }: HomeProps) {
  const caloriesData = [
    { day: 'السبت', calories: 1850 },
    { day: 'الأحد', calories: 2100 },
    { day: 'الاثنين', calories: 1900 },
    { day: 'الثلاثاء', calories: 2200 },
    { day: 'الأربعاء', calories: 1950 },
    { day: 'الخميس', calories: 2050 },
    { day: 'الجمعة', calories: 2150 },
  ];

  const macrosData = [
    { name: 'بروتين', value: 30, color: '#009E2A' },
    { name: 'كربوهيدرات', value: 45, color: '#00C236' },
    { name: 'دهون', value: 25, color: '#E8F5ED' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 pb-12 space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            مرحباً بك
          </h1>
          <p className="text-muted-foreground text-lg">دعنا نحقق أهدافك الصحية معاً</p>
        </div>
        {!isPremium && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPremiumAction(() => {})}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-3xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Crown className="w-5 h-5" />
            <span>احصل على المميز</span>
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white backdrop-blur-xl p-6 rounded-3xl border border-primary/10 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">السعرات اليومية</p>
          <p className="text-3xl font-bold">2,150</p>
          <p className="text-sm text-primary mt-1">من 2,300 كالوري</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white backdrop-blur-xl p-6 rounded-3xl border border-primary/10 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">الوجبات المتبقية</p>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm text-primary mt-1">من 5 وجبات</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white backdrop-blur-xl p-6 rounded-3xl border border-primary/10 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">الوزن الحالي</p>
          <p className="text-3xl font-bold">78.5</p>
          <p className="text-sm text-primary mt-1">-2.5 كجم هذا الشهر</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white backdrop-blur-xl p-6 rounded-3xl border border-primary/10 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <Award className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">الإنجازات</p>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-primary mt-1">وسام جديد</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 bg-white p-8 rounded-3xl border border-primary/10 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">السعرات الحرارية</h3>
              <p className="text-muted-foreground">آخر 7 أيام</p>
            </div>
            <div className="px-4 py-2 bg-secondary rounded-2xl">
              <p className="text-sm text-primary font-semibold">معدل: 2,029 كالوري</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={caloriesData}>
              <defs>
                <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#009E2A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C236" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#009E2A"
                strokeWidth={3}
                fill="url(#caloriesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl border border-primary/10 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-6">توزيع المغذيات</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={macrosData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {macrosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {macrosData.map((macro) => (
              <div key={macro.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="text-sm">{macro.name}</span>
                </div>
                <span className="font-bold">{macro.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl border border-primary/10 shadow-lg cursor-pointer"
          onClick={() => onPremiumAction(() => {})}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">خطة غذائية مخصصة</h3>
              <p className="text-muted-foreground">احصل على نظام غذائي مصمم خصيصاً لك</p>
            </div>
            <div className="p-3 bg-primary rounded-2xl">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
          {!isPremium && (
            <div className="mt-6 p-4 bg-primary/10 rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">ميزة حصرية للمشتركين</span>
            </div>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-primary to-accent text-white p-8 rounded-3xl shadow-lg cursor-pointer"
          onClick={() => onPremiumAction(() => {})}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">تحدث مع الطبيب</h3>
              <p className="text-white/80">احصل على استشارة مباشرة</p>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          {!isPremium && (
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center gap-3">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold">اشترك للوصول الفوري</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
