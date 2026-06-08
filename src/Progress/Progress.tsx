import { motion } from 'motion/react';
import { TrendingUp, Award, Target, Calendar, Flame, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProgressProps {
  onProtectedAction: (action: () => void) => void;
  isAuthenticated: boolean;
}

export default function Progress({ onProtectedAction }: ProgressProps) {
  const weightData = [
    { date: '1 يناير', weight: 85, goal: 75 },
    { date: '1 فبراير', weight: 83, goal: 75 },
    { date: '1 مارس', weight: 81, goal: 75 },
    { date: '1 أبريل', weight: 79.5, goal: 75 },
    { date: '1 مايو', weight: 78.5, goal: 75 },
  ];

  const weeklyActivity = [
    { day: 'السبت', calories: 2100, target: 2000 },
    { day: 'الأحد', calories: 1950, target: 2000 },
    { day: 'الاثنين', calories: 2200, target: 2000 },
    { day: 'الثلاثاء', calories: 1850, target: 2000 },
    { day: 'الأربعاء', calories: 2050, target: 2000 },
    { day: 'الخميس', calories: 1900, target: 2000 },
    { day: 'الجمعة', calories: 2100, target: 2000 },
  ];

  const achievements = [
    {
      title: 'أول أسبوع',
      description: 'أكملت أول أسبوع من رحلتك',
      icon: Award,
      color: 'from-primary to-accent',
      earned: true,
    },
    {
      title: 'فقدان 5 كجم',
      description: 'وصلت لهدف فقدان 5 كيلوغرام',
      icon: TrendingUp,
      color: 'from-accent to-primary',
      earned: true,
    },
    {
      title: 'التزام شهري',
      description: 'حافظت على الخطة لمدة شهر كامل',
      icon: Calendar,
      color: 'from-primary to-accent',
      earned: true,
    },
    {
      title: 'نصف الطريق',
      description: 'وصلت لنصف هدفك',
      icon: Target,
      color: 'from-accent to-primary',
      earned: false,
    },
  ];

  const handleSaveProgress = () => {
    onProtectedAction(() => {
      console.log('Saving progress...');
    });
  };

  return (
    <div className="p-6 md:p-8 pb-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            تقدمك
          </h1>
          <p className="text-muted-foreground text-lg">تتبع رحلتك نحو أهدافك</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveProgress}
          className="px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-3xl font-semibold shadow-lg"
        >
          حفظ التقدم
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-primary p-6 rounded-3xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-white/80 mb-1">الوزن الحالي</p>
          <p className="text-4xl font-bold">78.5 كجم</p>
          <p className="text-sm text-white/90 mt-2">-6.5 كجم من البداية</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-primary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">الهدف المتبقي</p>
          <p className="text-4xl font-bold">3.5 كجم</p>
          <p className="text-sm text-primary mt-2">من 10 كجم إجمالي</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-primary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <Award className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">أيام الالتزام</p>
          <p className="text-4xl font-bold">127</p>
          <p className="text-sm text-primary mt-2">يوم متواصل</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-primary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">الإنجازات</p>
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm text-primary mt-2">من 20 وسام</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6">تطور الوزن</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F5ED" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #009E2A20',
                borderRadius: '1rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#009E2A"
              strokeWidth={3}
              dot={{ fill: '#009E2A', r: 6 }}
              name="الوزن الفعلي"
            />
            <Line
              type="monotone"
              dataKey="goal"
              stroke="#00C236"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="الهدف"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6">السعرات الأسبوعية</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F5ED" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #009E2A20',
                borderRadius: '1rem',
              }}
            />
            <Bar dataKey="calories" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#009E2A" />
                <stop offset="100%" stopColor="#00C236" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-6">الإنجازات والأوسمة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: achievement.earned ? 1.05 : 1 }}
                className={`p-6 rounded-3xl ${
                  achievement.earned
                    ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div className={`p-3 rounded-2xl mb-4 inline-block ${
                  achievement.earned ? 'bg-white/20 backdrop-blur-xl' : 'bg-white/50'
                }`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                <p className={`text-sm ${achievement.earned ? 'text-white/80' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
