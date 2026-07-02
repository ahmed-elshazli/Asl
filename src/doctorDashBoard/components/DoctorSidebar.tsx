import { motion } from 'motion/react';
import { Activity, Users, MessageCircle, Apple, LogOut, X, Lock, Dumbbell, CreditCard, Home, Info, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMyProfile } from '../../users/hooks/useUsers';
import { useNavigate } from 'react-router-dom';

interface DoctorSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
}

const NAV_ITEMS = [
  { id: 'overview',   label: 'لوحة التحكم',     icon: Activity },
  { id: 'patients',   label: 'المرضى',           icon: Users },
  { id: 'messages',   label: 'الرسائل',          icon: MessageCircle },
  { id: 'plans',      label: 'الخطط الغذائية',   icon: Apple },
  { id: 'workouts',   label: 'التمارين والبرامج',icon: Dumbbell },
  { id: 'subscription-plans', label: 'باقات الاشتراك', icon: CreditCard },
  { id: 'reviews',    label: 'التقييمات',        icon: Star },
  { id: 'about-us',   label: 'من نحن',           icon: Info },
];

export function DoctorSidebar({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
  onChangePassword,
}: DoctorSidebarProps) {
  const { user: authUser } = useAuthStore();
  const { data: fetchedProfile } = useMyProfile();
  
  const actualFetched = fetchedProfile?.user?.user || fetchedProfile?.user || fetchedProfile;
  const user = actualFetched || authUser;
  
  const navigate = useNavigate();

  const handleNav = (id: string) => {
    setActiveSection(id);
    setIsSidebarOpen(false);
  };

  return (
    <aside
      className={`
        w-72 bg-white border-l border-primary/10 min-h-screen p-6
        lg:block lg:sticky lg:top-0
        fixed top-0 right-0 z-50 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0
        transition-transform duration-300 ease-in-out lg:transition-none
      `}
    >
      {/* Close - Mobile */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden absolute top-4 left-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
      >
        <X className="w-5 h-5 text-muted-foreground" />
      </motion.button>

      {/* Doctor Profile */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold overflow-hidden shadow-md flex-shrink-0">
            {user?.images?.[0] ? (
              <img src={user.images[0]} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.fullName?.charAt(0).toUpperCase() || 'د'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold truncate" title={user?.fullName || 'دكتور'}>{user?.fullName || 'دكتور'}</h3>
            <p className="text-xs text-muted-foreground truncate" title={user?.email || ''}>{user?.email || 'أخصائي تغذية'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-primary bg-primary/5 hover:bg-primary/10 mb-4"
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold">العودة للرئيسية</span>
        </motion.button>
        
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02, x: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-12 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onChangePassword();
            setIsSidebarOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-secondary transition-all"
        >
          <Lock className="w-5 h-5" />
          <span className="font-semibold">تغيير كلمة المرور</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">تسجيل الخروج</span>
        </motion.button>
      </div>
    </aside>
  );
}