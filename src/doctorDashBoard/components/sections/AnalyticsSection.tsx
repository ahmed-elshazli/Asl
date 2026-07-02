import { motion } from 'motion/react';
import { Filter, Download, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { stats, monthlyData, recentPatients, successRateData } from '../doctorDashboardData';

export function AnalyticsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">الإحصائيات والتحليلات</h1>
          <p className="text-muted-foreground text-base md:text-lg">تحليل شامل للأداء والنتائج</p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 md:px-6 py-3 bg-white rounded-full font-semibold flex items-center gap-2 border border-primary/10 shadow-lg text-sm md:text-base"
          >
            <Filter className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="hidden sm:inline">تصفية</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 md:px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm md:text-base"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">تصدير</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  {stat.trend}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">معدل النجاح حسب نوع الخطة</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={successRateData}>
              <XAxis key="bar-x-axis" dataKey="type" stroke="#6B7280" />
              <YAxis key="bar-y-axis" stroke="#6B7280" />
              <Tooltip
                key="bar-tooltip"
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #009E2A20',
                  borderRadius: '1rem',
                }}
              />
              <Bar key="success-bar" dataKey="success" fill="url(#successGradient)" radius={[12, 12, 0, 0]} />
              <defs key="bar-defs">
                <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop-1" offset="0%" stopColor="#009E2A" />
                  <stop key="stop-2" offset="100%" stopColor="#00C236" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">الإيرادات الشهرية</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs key="area-defs">
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop-1" offset="5%" stopColor="#009E2A" stopOpacity={0.3} />
                  <stop key="stop-2" offset="95%" stopColor="#00C236" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis key="area-x-axis" dataKey="month" stroke="#6B7280" />
              <YAxis key="area-y-axis" stroke="#6B7280" />
              <Tooltip
                key="area-tooltip"
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #009E2A20',
                  borderRadius: '1rem',
                }}
              />
              <Area
                key="revenue-area"
                type="monotone"
                dataKey="revenue"
                stroke="#009E2A"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">أفضل المرضى أداءً</h2>
        <div className="space-y-3">
          {[...recentPatients]
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 5)
            .map((patient, idx) => (
              <motion.div
                key={patient.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary transition-all"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate">{patient.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{patient.goal}</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="text-2xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                    {patient.progress}%
                  </div>
                  <p className="text-xs text-muted-foreground">التقدم</p>
                </div>
                <Award className="w-6 h-6 text-accent flex-shrink-0 hidden md:block" />
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
