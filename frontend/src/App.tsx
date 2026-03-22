import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import PublicLayout from '@/layouts/PublicLayout';
import AppLayout from '@/layouts/AppLayout';
import { ProtectedRoute, AdminRoute } from '@/components/RouteGuards';
import LandingPage from '@/pages/LandingPage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AnalyzePage from '@/pages/AnalyzePage';
import HistoryPage from '@/pages/HistoryPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLoginPage from '@/pages/AdminLoginPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  useThemeStore(); // Initialize theme

  // Run once on mount only — empty deps array prevents re-runs that cause flickering
  useEffect(() => { useAuthStore.getState().checkAuth(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Admin portal login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Auth routes (no navbar/footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app routes */}
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="about" element={<AboutPage />} />        

          {/* Admin routes */}
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
