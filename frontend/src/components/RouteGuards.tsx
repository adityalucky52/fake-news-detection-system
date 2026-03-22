import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  if (isInitializing) return (
    <div className="flex items-center justify-center h-screen text-primary">
      <Loader className="animate-spin h-8 w-8" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  if (isInitializing) return (
    <div className="flex items-center justify-center h-screen text-primary">
      <Loader className="animate-spin h-8 w-8" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== 'admin') return <Navigate to="/app/analyze" replace />;
  return <>{children}</>;
}
