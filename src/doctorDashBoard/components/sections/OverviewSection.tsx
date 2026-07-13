import { motion } from 'motion/react';
import {
  Users,
  UserPlus,
  CreditCard,
  TrendingUp,
  Activity,
  Crown,
  Star,
  Scale,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CalendarClock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAdminOverview, useAdminGrowth, useAdminActivity } from '../../hooks/useAdminDashboard';
import type { ActivityItem, RevenueByPlan } from '../../api/adminDashboardApi';

// ==========================================
// Month names in Arabic
// ==========================================
const MONTH_NAMES = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// ==========================================
// Stat Card Component
// ==========================================
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; label: string };
  delay?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', bounce: 0.3 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend.value >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            {trend.value >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.label}
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-foreground mb-1">{value}</div>
      <div className="text-xs text-muted-foreground font-medium">{title}</div>
      {subtitle && <div className="text-[11px] text-muted-foreground/70 mt-1">{subtitle}</div>}
    </motion.div>
  );
}

// ==========================================
// Activity Type Helpers
// ==========================================
function getActivityIcon(type: string) {
  switch (type) {
    case 'USER_REGISTERED': return UserPlus;
    case 'SUBSCRIPTION_CREATED': return Crown;
    case 'REVIEW_ADDED': return Star;
    case 'WEIGHT_UPDATED': return Scale;
    default: return Activity;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'USER_REGISTERED': return 'bg-blue-500';
    case 'SUBSCRIPTION_CREATED': return 'bg-emerald-500';
    case 'REVIEW_ADDED': return 'bg-amber-500';
    case 'WEIGHT_UPDATED': return 'bg-violet-500';
    default: return 'bg-gray-500';
  }
}

function getActivityTitle(type: string) {
  switch (type) {
    case 'USER_REGISTERED': return 'مستخدم جديد';
    case 'SUBSCRIPTION_CREATED': return 'اشتراك جديد';
    case 'REVIEW_ADDED': return 'تقييم جديد';
    case 'WEIGHT_UPDATED': return 'تحديث وزن';
    default: return 'نشاط';
  }
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `منذ ${days} يوم`;
  return new Date(dateStr).toLocaleDateString('ar-EG');
}

// ==========================================
// Custom Tooltip for Charts
// ==========================================
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-border/50 text-sm" dir="rtl">
      <div className="font-bold text-foreground mb-1">{label}</div>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span>{entry.name}: <strong className="text-foreground">{entry.value}</strong></span>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Loading Skeleton
// ==========================================
function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-32 border border-border/30" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl h-80 border border-border/30" />
        <div className="bg-white rounded-2xl h-80 border border-border/30" />
      </div>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export default function OverviewSection() {
  const { data: overview, isLoading: loadingOverview, refetch: refetchOverview } = useAdminOverview();
  const { data: growth, isLoading: loadingGrowth } = useAdminGrowth();
  const { data: activity, isLoading: loadingActivity } = useAdminActivity();

  const isLoading = loadingOverview || loadingGrowth || loadingActivity;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground font-medium">جاري تحميل لوحة التحكم...</span>
        </div>
        <OverviewSkeleton />
      </div>
    );
  }

  const users = overview?.users;
  const subs = overview?.subscriptions;
  const plans = overview?.subscriptionPlans;
  const revenue = overview?.revenue;
  const activities = activity?.activities || [];

  // Merge growth data for combined chart
  const growthData = mergeGrowthData(growth?.usersGrowth || [], growth?.subscriptionsGrowth || []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">نظرة عامة</h2>
          <p className="text-sm text-muted-foreground mt-1">ملخص شامل لأداء المنصة</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetchOverview()}
          className="p-2.5 bg-white rounded-xl border border-border/50 hover:bg-secondary transition-colors shadow-sm"
          title="تحديث البيانات"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* ==========================================
          KPI Cards - Users
          ========================================== */}
      <section>
        <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" /> المستخدمين
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="إجمالي المستخدمين"
            value={users?.total ?? 0}
            icon={Users}
            color="bg-blue-500"
            delay={0}
          />
          <StatCard
            title="نشط"
            value={users?.active ?? 0}
            subtitle={`غير نشط: ${users?.inactive ?? 0}`}
            icon={Activity}
            color="bg-emerald-500"
            delay={0.05}
          />
          <StatCard
            title="المرضى"
            value={users?.patients ?? 0}
            icon={Users}
            color="bg-cyan-500"
            delay={0.1}
          />
          <StatCard
            title="جدد اليوم"
            value={users?.newToday ?? 0}
            subtitle={`هذا الشهر: ${users?.newThisMonth ?? 0}`}
            icon={UserPlus}
            color="bg-violet-500"
            trend={users?.newToday ? { value: users.newToday, label: `+${users.newToday}` } : undefined}
            delay={0.15}
          />
          <StatCard
            title="متوسط العمر / الوزن"
            value={`${users?.averageAge ?? 0} سنة`}
            subtitle={`الوزن: ${users?.averageWeight ?? 0} كجم`}
            icon={Scale}
            color="bg-amber-500"
            delay={0.2}
          />
        </div>
      </section>

      {/* ==========================================
          KPI Cards - Subscriptions & Revenue
          ========================================== */}
      <section>
        <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> الاشتراكات والإيرادات
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="إجمالي الاشتراكات"
            value={subs?.total ?? 0}
            icon={CreditCard}
            color="bg-indigo-500"
            delay={0.05}
          />
          <StatCard
            title="اشتراكات نشطة"
            value={subs?.active ?? 0}
            subtitle={`منتهية: ${subs?.expired ?? 0} | ملغاة: ${subs?.cancelled ?? 0}`}
            icon={Crown}
            color="bg-emerald-500"
            delay={0.1}
          />
          <StatCard
            title="تنتهي خلال أسبوع"
            value={subs?.expiringSoon ?? 0}
            icon={AlertTriangle}
            color={subs?.expiringSoon ? 'bg-orange-500' : 'bg-gray-400'}
            trend={subs?.expiringSoon ? { value: -1, label: 'تنبيه' } : undefined}
            delay={0.15}
          />
          <StatCard
            title="إجمالي الإيرادات"
            value={`${(revenue?.totalRevenue ?? 0).toLocaleString('ar-EG')}`}
            subtitle="EGP"
            icon={DollarSign}
            color="bg-primary"
            delay={0.2}
          />
          <StatCard
            title="إيرادات الشهر"
            value={`${(revenue?.monthlyRevenue ?? 0).toLocaleString('ar-EG')}`}
            subtitle="EGP"
            icon={TrendingUp}
            color="bg-teal-500"
            delay={0.25}
          />
        </div>
      </section>

      {/* ==========================================
          Charts Row
          ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
        >
          <h3 className="text-lg font-bold text-foreground mb-1">📈 النمو الشهري</h3>
          <p className="text-xs text-muted-foreground mb-6">عدد المستخدمين والاشتراكات الجديدة شهرياً</p>
          {growthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="مستخدمين"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="subscriptions"
                  name="اشتراكات"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#colorSubs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
              لا توجد بيانات نمو حتى الآن
            </div>
          )}
        </motion.div>

        {/* Revenue by Plan Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
        >
          <h3 className="text-lg font-bold text-foreground mb-1">💰 الإيرادات حسب الباقة</h3>
          <p className="text-xs text-muted-foreground mb-6">توزيع الإيرادات والمشتركين لكل باقة</p>
          {revenue?.revenueByPlan && revenue.revenueByPlan.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenue.revenueByPlan} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="plan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="revenue"
                  name="الإيرادات (EGP)"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="subscribers"
                  name="المشتركين"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
              لا توجد بيانات إيرادات حتى الآن
            </div>
          )}
        </motion.div>
      </section>

      {/* ==========================================
          Bottom Row: Activity Feed + Plans Summary
          ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-border/50"
        >
          <h3 className="text-lg font-bold text-foreground mb-1">🔔 آخر الأنشطة</h3>
          <p className="text-xs text-muted-foreground mb-6">أحدث الأحداث والتفاعلات على المنصة</p>

          {activities.length > 0 ? (
            <div className="space-y-1">
              {activities.map((item: ActivityItem, idx: number) => {
                const Icon = getActivityIcon(item.type);
                const bgColor = getActivityColor(item.type);
                const userName = item.user?.name || item.user?.fullName || 'مستخدم';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.04 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className={`p-2 rounded-xl ${bgColor} shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground truncate">{userName}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">
                          {getActivityTitle(item.type)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <CalendarClock className="w-3 h-3" />
                        {formatTimeAgo(item.createdAt)}
                        {item.rating !== undefined && <span className="flex items-center gap-0.5">⭐ {item.rating}</span>}
                        {item.weight !== undefined && <span>{item.weight} كجم</span>}
                        {item.plan && <span className="text-primary font-medium">{(item.plan as any)?.name}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              لا توجد أنشطة حديثة
            </div>
          )}
        </motion.div>

        {/* Plans & Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
        >
          <h3 className="text-lg font-bold text-foreground mb-1">📦 الباقات</h3>
          <p className="text-xs text-muted-foreground mb-6">ملخص باقات الاشتراك</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-sm font-medium text-muted-foreground">إجمالي الباقات</span>
              <span className="text-lg font-black text-foreground">{plans?.total ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <span className="text-sm font-medium text-emerald-700">باقات نشطة</span>
              <span className="text-lg font-black text-emerald-600">{plans?.active ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <span className="text-sm font-medium text-red-700">باقات متوقفة</span>
              <span className="text-lg font-black text-red-600">{plans?.inactive ?? 0}</span>
            </div>
            {plans?.popularPlan && (
              <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
                <div className="text-xs text-muted-foreground mb-1">الباقة الأكثر طلباً</div>
                <div className="text-base font-bold text-primary flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {plans.popularPlan}
                </div>
              </div>
            )}

            {/* Revenue breakdown mini list */}
            {revenue?.revenueByPlan && revenue.revenueByPlan.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="text-xs font-bold text-muted-foreground mb-3">تفاصيل الإيرادات</div>
                <div className="space-y-2">
                  {revenue.revenueByPlan.map((item: RevenueByPlan, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{item.plan}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-foreground">{item.revenue.toLocaleString('ar-EG')} EGP</span>
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                          {item.subscribers} مشترك
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

// ==========================================
// Helper: Merge growth data for combined chart
// ==========================================
function mergeGrowthData(
  usersGrowth: Array<{ year: number; month: number; users?: number }>,
  subscriptionsGrowth: Array<{ year: number; month: number; subscriptions?: number }>
) {
  const map = new Map<string, { label: string; users: number; subscriptions: number }>();

  for (const point of usersGrowth) {
    const key = `${point.year}-${point.month}`;
    const label = `${MONTH_NAMES[point.month]} ${point.year}`;
    if (!map.has(key)) {
      map.set(key, { label, users: 0, subscriptions: 0 });
    }
    map.get(key)!.users = point.users ?? 0;
  }

  for (const point of subscriptionsGrowth) {
    const key = `${point.year}-${point.month}`;
    const label = `${MONTH_NAMES[point.month]} ${point.year}`;
    if (!map.has(key)) {
      map.set(key, { label, users: 0, subscriptions: 0 });
    }
    map.get(key)!.subscriptions = point.subscriptions ?? 0;
  }

  return Array.from(map.values());
}
