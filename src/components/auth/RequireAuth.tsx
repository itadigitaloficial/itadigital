import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redireciona para o login, salvando a localização atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // Redireciona usuários não-admin para a home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
