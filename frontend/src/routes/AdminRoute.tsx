import type { ReactNode } from 'react'; 
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  if (isAuthenticated && user?.role === 'ADMIN') {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;