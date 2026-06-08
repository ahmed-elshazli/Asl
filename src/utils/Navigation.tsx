import { Home, UtensilsCrossed, TrendingUp, MessageCircle, CreditCard, User, Menu, X, Sparkles, Activity, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated: boolean;
  onShowLogin: () => void;
}

export function Navigation({ isAuthenticated, onShowLogin }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // إضافة مسار (path) لكل تاب ليتوافق مع الراوتر
  const tabs = [
    { id: 'landing', path: '/', label: 'الرئيسية', icon: Home, requireAuth: false },
    { id: 'home', path: '/dashboard', label: 'لوحة التحكم', icon: Activity, requireAuth: true },
    { id: 'diet', path: '/diet', label: 'الخطط الغذائية', icon: UtensilsCrossed, requireAuth: false },
    { id: 'workouts', path: '/workouts', label: 'التمارين', icon: Dumbbell, requireAuth: false },
    { id: 'progress', path: '/progress', label: 'التقدم', icon: TrendingUp, requireAuth: true },
    { id: 'messaging', path: '/messaging', label: 'الرسائل', icon: MessageCircle, requireAuth: true },
    { id: 'subscription', path: '/subscription', label: 'الاشتراك', icon: CreditCard, requireAuth: true },
    { id: 'profile', path: '/profile', label: 'الملف الشخصي', icon: User, requireAuth: true },
  ];

  // تحديد التاب النشط بناءً على مسار الصفحة الحالية
  const activeTabId = tabs.find(t => t.path === location.pathname)?.id || 'landing';

  // دالة التنقل باستخدام الراوتر
  const handleTabChange = (path: string, requireAuth: boolean) => {
    if (requireAuth && !isAuthenticated) {
      onShowLogin();
      setIsMenuOpen(false);
    } else {
      navigate(path);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-primary/10 shadow-lg"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  أصِل
                </h1>
                <p className="text-xs text-muted-foreground">نظام التغذية الذكي</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTabId === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.path, tab.requireAuth)}
                    className={`relative px-6 py-3 rounded-3xl transition-all duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-3xl bg-primary"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{tab.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                        أصِل
                      </h2>
                      <p className="text-xs text-muted-foreground">نظام التغذية الذكي</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab, idx) => {
                    const Icon = tab.icon;
                    const isActive = activeTabId === tab.id;

                    return (
                      <motion.button
                        key={tab.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleTabChange(tab.path, tab.requireAuth)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-muted-foreground hover:bg-secondary hover:text-primary'
                        }`}
                        whileHover={{ scale: 1.02, x: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-lg font-semibold">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>

                <div className="mt-12 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-primary/20">
                  <Sparkles className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">احصل على المميز</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    استمتع بجميع الميزات الحصرية
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTabChange('/subscription', true)}
                    className="w-full py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg"
                  >
                    اشترك الآن
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}