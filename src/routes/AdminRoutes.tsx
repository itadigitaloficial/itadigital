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
  if (!user || user.type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/blog" element={<BlogManagement />} />
      <Route path="/clientes" element={<div>Gestão de Clientes</div>} />
      <Route path="/empresas" element={<div>Gestão de Empresas</div>} />
      <Route path="/servicos" element={<div>Gestão de Serviços</div>} />
      <Route path="*" element={<Navigate to="/admin/blog" replace />} />
    </Routes>
  );
}
