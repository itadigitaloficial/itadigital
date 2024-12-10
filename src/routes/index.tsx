import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminRoutes } from './AdminRoutes';
import { Blog } from '../pages/Blog';
import { Login } from '../pages/Login';
import { RequireAuth } from '../components/auth/RequireAuth';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ToastContainer } from '../components/ui/ToastContainer';
import { SEO } from '../components/SEO';

export function AppRoutes() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <SEO /> {/* SEO padrão para todo o site */}
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/blog/*" element={<Blog />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas administrativas (protegidas) */}
              <Route
                path="/admin/*"
                element={
                  <RequireAuth requireAdmin>
                    <AdminLayout>
                      <AdminRoutes />
                    </AdminLayout>
                  </RequireAuth>
                }
              />

              {/* Rota 404 */}
              <Route path="*" element={<div>Página não encontrada</div>} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
