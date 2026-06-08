import React from 'react';
import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoginModal } from '../utils/LoginModal'; // تأكد من المسار الصحيح

// استيراد الصفحات
import { Landing } from '../landing/Landing';
import DoctorDashboard from '../doctorDashBoard/DoctorDashboard';
import{ Home } from '../DashBoard/Home';

const DietPlans = lazy(() => import('../dietPlans/DietPlans'));
const Workouts = lazy(() => import('../workOuts/Workouts'));
const Profile = lazy(() => import('../profile/Profile')); // تأكد إن اسم المجلد صح عندك
const Subscription = lazy(() => import('../Subscription/Subscription'));
const Progress = lazy(() => import('../Progress/Progress'));
const Messaging = lazy(() => import('../Messaging/Messaging'));
// 1. تحديث الـ Props لاستقبال دالة تغيير حالة الدخول
interface AppRoutesProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode; // تأكد أن الكلمة ReactNode وليست Element
}
const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export function AppRoutes({ isAuthenticated, setIsAuthenticated }: AppRoutesProps) {
  // 2. التحكم في المودال والتوجيه من داخل الراوتر
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const navigate = useNavigate();

  const handleProtectedAction = (action: () => void) => {
    if (isAuthenticated) {
      action(); // لو مسجل دخول، نفذ الأكشن (مثلاً: إتمام الدفع)
    } else {
      setShowLoginModal(true); // لو مش مسجل، افتح نافذة الدخول
    }
  };

  const handleSubscribe = () => {
    console.log("تمت عملية الاشتراك بنجاح!");
    setIsPremiumUser(true); // ده اللي هيغير شكل الصفحة فوراً!
  };
  // دالة تسجيل الخروج
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  // 3. دالة تسجيل الدخول التي توجه الطبيب للداشبورد والمريض للرئيسية
  const handleLogin = (type: 'patient' | 'doctor') => {
    setIsAuthenticated(true);
    setShowLoginModal(false);

    if (type === 'doctor') {
      navigate('/doctor-dashboard'); // توجيه الطبيب
    } else {
      navigate('/home'); // توجيه المريض
    }
  };

  return (
    <>
      <Routes>
        {/* نمرر دالة فتح المودال للـ Layout */}
        <Route element={<MainLayout isAuthenticated={isAuthenticated} onShowLogin={() => setShowLoginModal(true)} />}>
          
          {/* المسارات العامة */}
          <Route path="/" element={<Landing isAuthenticated={isAuthenticated} onShowLogin={() => setShowLoginModal(true)} />} />
          
          <Route 
            path="/diet" 
            element={
              <Suspense fallback={<PageLoader />}>
                <DietPlans isPremium={false} onPremiumAction={() => setShowLoginModal(true)} />
              </Suspense>
            } 
          />
          
          <Route 
            path="/workouts" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Workouts isPremium={false} onPremiumAction={() => setShowLoginModal(true)} />
              </Suspense>
            } 
          />

          <Route 
  path="/profile" 
  element={
    <Suspense fallback={<PageLoader />}>
      <Profile 
        isAuthenticated={isAuthenticated} 
        onProtectedAction={() => setShowLoginModal(true)} 
        onLogout={handleLogout} 
      />
    </Suspense>
  } 
/>

<Route 
  path="/subscription" 
  element={
    <Suspense fallback={<PageLoader />}>
      <Subscription 
        isAuthenticated={isAuthenticated} 
        isPremium={isPremiumUser} // 👈 التعديل هنا
        onProtectedAction={handleProtectedAction}
        onSubscribe={handleSubscribe}
      />
    </Suspense>
  } 
/>

<Route 
  path="/progress" 
  element={
    <Suspense fallback={<PageLoader />}>
      <Progress 
        isAuthenticated={isAuthenticated} 
        onProtectedAction={handleProtectedAction} 
      />
    </Suspense>
  } 
/>

<Route 
  path="/messaging" 
  element={
    <Suspense fallback={<PageLoader />}>
      <Messaging 
        isPremium={isPremiumUser} // ربطناها بحالة الاشتراك اللي عملناها
        onPremiumAction={handleProtectedAction} // بتطلب تسجيل الدخول لو مش مسجل
      />
    </Suspense>
  } 
/>
          
          {/* 🟢 المسارات المحمية */}
          <Route 
            path="/doctor-dashboard" // تم تصحيح المسار هنا
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DoctorDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      {/* تمرير الخصائص التي يطلبها المكون فعلاً */}
      <Home 
        isAuthenticated={isAuthenticated} 
        isPremium={false} 
        onPremiumAction={() => setShowLoginModal(true)} 
        onProtectedAction={() => setShowLoginModal(true)} 
      />
    </ProtectedRoute>
  } 
/>
          
          {/* مسار افتراضي (Catch-all) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {/* 4. إظهار نافذة تسجيل الدخول هنا لتمكين التوجيه */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}