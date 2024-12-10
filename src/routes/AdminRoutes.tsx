import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { BlogManagement } from '../components/admin/BlogManagement';
import { useAuth } from '../hooks/useAuth';

export function AdminRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  // Verifica se o usuário está autenticado e tem permissão de admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/blog" element={<BlogManagement />} />
      {/* Adicione outras rotas admin aqui */}
      <Route path="*" element={<Navigate to="/admin/blog" replace />} />
    </Routes>
  );
}
