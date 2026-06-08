import { motion } from 'motion/react';
import { User, Mail, Phone, Calendar, LogOut, Crown, Award, Target, Activity } from 'lucide-react';

interface ProfileProps {
  onProtectedAction: (action: () => void) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Profile({ onProtectedAction, isAuthenticated, onLogout }: ProfileProps) {
  if (!isAuthenticated) {
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-white rounded-[3rem] p-16 border border-primary/10 shadow-lg">
            <div className="inline-flex p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-8">
              <User className="w-20 h-20 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4">سجل دخولك</h2>
            <p className="text-muted-foreground text-lg mb-8">
              سجل الدخول للوصول إلى ملفك الشخصي وجميع بياناتك
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProtectedAction(() => {})}
              className="px-8 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold text-lg shadow-lg"
            >
              تسجيل الدخول
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { label: 'أيام الالتزام', value: '127', icon: Calendar, color: 'from-primary to-accent' },
    { label: 'الإنجازات', value: '12', icon: Award, color: 'from-accent to-primary' },
    { label: 'الوزن المفقود', value: '6.5 كجم', icon: Target, color: 'from-primary to-accent' },
    { label: 'السعرات اليومية', value: '2,150', icon: Activity, color: 'from-accent to-primary' },
  ];

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          الملف الشخصي
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-6xl font-bold border-4 border-white/30">
              م.أ
            </div>
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h2 className="text-4xl font-bold">محمد أحمد</h2>
                <Crown className="w-8 h-8" />
              </div>
              <p className="text-white/80 text-lg mb-4">مشترك مميز منذ يناير 2025</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>mohamed@example.com</span>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+966 50 123 4567</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg text-center"
              >
                <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-2xl mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-6">المعلومات الشخصية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الاسم الكامل</label>
              <input
                type="text"
                defaultValue="محمد أحمد"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">البريد الإلكتروني</label>
              <input
                type="email"
                defaultValue="mohamed@example.com"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">رقم الهاتف</label>
              <input
                type="tel"
                defaultValue="+966 50 123 4567"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">تاريخ الميلاد</label>
              <input
                type="text"
                defaultValue="15 مارس 1990"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg"
            >
              حفظ التغييرات
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="px-8 py-4 bg-red-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-6">الأهداف الصحية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الوزن الحالي</label>
              <input
                type="text"
                defaultValue="78.5 كجم"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الوزن المستهدف</label>
              <input
                type="text"
                defaultValue="75 كجم"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الطول</label>
              <input
                type="text"
                defaultValue="175 سم"
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">مستوى النشاط</label>
              <select className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary">
                <option>قليل النشاط</option>
                <option>نشاط معتدل</option>
                <option>نشاط عالي</option>
              </select>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
