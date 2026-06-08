import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '../utils/Navigation';

interface MainLayoutProps {
  isAuthenticated: boolean;
  onShowLogin: () => void;
}

export function MainLayout({ isAuthenticated, onShowLogin }: MainLayoutProps) {
  // 1. استخدام useLocation لمعرفة المسار الحالي
  const location = useLocation();
  
  // 2. التحقق هل إحنا في صفحة داشبورد الطبيب؟ (تم تعديل المسار هنا)
  const isDoctorDashboard = location.pathname === '/doctor-dashboard';

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col" dir="rtl">
      
      {/* 3. إخفاء الـ Navigation لو إحنا في داشبورد الطبيب */}
      {!isDoctorDashboard && (
        <Navigation 
          isAuthenticated={isAuthenticated} 
          onShowLogin={onShowLogin} 
        />
      )}

      {/* 4. إزالة الـ pt-24 لو إحنا في داشبورد الطبيب عشان ميبقاش فيه فراغ فوق */}
      <main className={isDoctorDashboard ? "" : "pt-24"}>
        <Outlet /> 
      </main>

    </div>
  );
}