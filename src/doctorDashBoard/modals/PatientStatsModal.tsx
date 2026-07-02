import { motion } from 'motion/react';
import { X, Sparkles, TrendingUp, Award, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePatientDashboard } from '../../DashBoard/hooks/usePatientDashboard';

interface PatientStatsModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export function PatientStatsModal({ userId, userName, onClose }: PatientStatsModalProps) {
  const { data: dashboard, isLoading } = usePatientDashboard(userId);

  const overview = dashboard?.overview || {};

  const daysMap: Record<string, string> = {
    Sat: 'السبت', Sun: 'الأحد', Mon: 'الإثنين',
    Tue: 'الثلاثاء', Wed: 'الأربعاء', Thu: 'الخميس', Fri: 'الجمعة'
  };

  const caloriesData = overview?.weeklyCaloriesBurned?.map((d: any) => ({
    day: daysMap[d.day] || d.day,
    calories: d.calories
  })) || [];

  const weightData = overview?.weightProgress?.length > 0
    ? overview.weightProgress
    : [];

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
        className="relative w-full max-w-5xl bg-background rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">إحصائيات المريض</h2>
              <p className="text-sm text-white/70">{userName}</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-bold">جاري تحميل الإحصائيات...</p>
            </div>
          ) : (
            <>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-3xl border border-primary/10 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary rounded-2xl">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-1 text-sm">السعرات المحروقة</p>
                  <p className="text-2xl font-bold">{overview.totalCaloriesBurned || 0}</p>
                  <p className="text-xs text-primary mt-1">إجمالي السعرات</p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-3xl border border-primary/10 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary rounded-2xl">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-1 text-sm">البرامج النشطة</p>
                  <p className="text-2xl font-bold">{overview.activePrograms || 0}</p>
                  <p className="text-xs text-primary mt-1">{overview.completedPrograms || 0} مكتمل</p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-3xl border border-primary/10 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary rounded-2xl">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-1 text-sm">الوزن الحالي</p>
                  <p className="text-2xl font-bold">{overview.currentWeight || 0} كجم</p>
                  <p className="text-xs text-primary mt-1">مفقود: {overview.weightLost || 0} كجم</p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-3xl border border-primary/10 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary rounded-2xl">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-1 text-sm">التمارين المكتملة</p>
                  <p className="text-2xl font-bold">{overview.completedExercises || 0}</p>
                  <p className="text-xs text-primary mt-1">إجمالي التمارين</p>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-primary/10 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">استهلاك السعرات الحرارية</h3>
                      <p className="text-xs text-muted-foreground">آخر 7 أيام</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={caloriesData}>
                      <defs>
                        <linearGradient id="calGradientModal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#009E2A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00C236" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area
                        type="monotone"
                        dataKey="calories"
                        stroke="#009E2A"
                        strokeWidth={3}
                        fill="url(#calGradientModal)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-lg">
                  <h3 className="text-xl font-bold mb-6">تطور الوزن</h3>
                  {weightData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={weightData}>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="weight" stroke="#00C236" strokeWidth={3} dot={{ fill: '#009E2A', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm bg-secondary/30 rounded-2xl border border-dashed border-primary/20">
                      لا توجد بيانات كافية لتتبع الوزن حتى الآن
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
