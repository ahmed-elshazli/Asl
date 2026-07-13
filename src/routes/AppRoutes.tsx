import React from 'react';
import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoginModal } from '../utils/LoginModal';
import { PoliciesModal } from '../utils/PoliciesModal';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../login/hooks/useLogout';
import { useMyCurrentSubscription } from '../doctorDashBoard/hooks/useSubscriptions';

import { Landing } from '../landing/Landing';
import DoctorDashboard from '../doctorDashBoard/DoctorDashboard';
import { Home } from '../DashBoard/Home';

const DietPlans    = lazy(() => import('../dietPlans/DietPlans'));
const Workouts     = lazy(() => import('../workOuts/Workouts'));
const Profile      = lazy(() => import('../profile/Profile'));
const Subscription = lazy(() => import('../Subscription/Subscription'));
const Messaging    = lazy(() => import('../Messaging/Messaging'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// ✅ مسارات عامة — بس يكون logged in
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// ✅ doctor-dashboard — للـ doctor والـ admin بس
const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'doctor' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export function AppRoutes() {
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const navigate = useNavigate();

  // Source of truth for premium access is the patient's real subscription
  // status, not local state — a fake flag here would go stale the moment
  // a doctor approves/rejects/cancels from the other side of the app.
  const { data: currentSubscription } = useMyCurrentSubscription(isAuthenticated);
  const isPremiumUser = currentSubscription?.status === 'ACTIVE';

  const handleShowLoginFlow = () => {
    const hasAgreed = localStorage.getItem('policiesAgreed') === 'true';
    if (hasAgreed) {
      setShowLoginModal(true);
    } else {
      setShowPoliciesModal(true);
    }
  };

  const handleAgreePolicies = () => {
    localStorage.setItem('policiesAgreed', 'true');
    setShowPoliciesModal(false);
    setShowLoginModal(true);
  };

  const handleProtectedAction = (action?: () => void) => {
    if (isAuthenticated) action?.();
    else handleShowLoginFlow();
  };

  const { mutate: logoutAPI } = useLogout();

  const handleLogout = () => {
    logoutAPI();
  };

  // ✅ doctor أو admin → doctor-dashboard
  const handleLogin = () => {
    setShowLoginModal(false);
    const role = useAuthStore.getState().user?.role;
    if (role === 'doctor' || role === 'admin') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Routes>
        <Route
          element={
            <MainLayout
              isAuthenticated={isAuthenticated}
              onShowLogin={handleShowLoginFlow}
            />
          }
        >
          <Route
            path="/"
            element={
              <Landing
                isAuthenticated={isAuthenticated}
                onShowLogin={handleShowLoginFlow}
              />
            }
          />

          <Route path="/diet" element={
            <Suspense fallback={<PageLoader />}>
              <DietPlans />
            </Suspense>
          } />

          <Route path="/workouts" element={
            <Suspense fallback={<PageLoader />}>
              <Workouts />
            </Suspense>
          } />

          <Route path="/profile" element={
            <Suspense fallback={<PageLoader />}>
              <Profile isAuthenticated={isAuthenticated} onProtectedAction={() => setShowLoginModal(true)} onLogout={handleLogout} />
            </Suspense>
          } />

          <Route path="/subscription" element={
            <Suspense fallback={<PageLoader />}>
              <Subscription isAuthenticated={isAuthenticated} isPremium={isPremiumUser} onProtectedAction={handleProtectedAction} onSubscribe={() => {}} />
            </Suspense>
          } />

          <Route path="/messaging" element={
            <Suspense fallback={<PageLoader />}>
              <Messaging isPremium={isPremiumUser} onPremiumAction={handleProtectedAction} />
            </Suspense>
          } />

          {/* ✅ doctor و admin */}
          <Route
            path="/doctor-dashboard"
            element={
              <DoctorRoute>
                <DoctorDashboard onLogout={handleLogout} />
              </DoctorRoute>
            }
          />

          {/* ✅ patient */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home
                  isAuthenticated={isAuthenticated}
                  isPremium={isPremiumUser}
                  onPremiumAction={() => navigate('/subscription')}
                  onProtectedAction={() => navigate('/subscription')}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {showPoliciesModal && (
        <PoliciesModal
          onClose={() => setShowPoliciesModal(false)}
          onAgree={handleAgreePolicies}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}