import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import type { ReactNode } from 'react';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Carregando...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};