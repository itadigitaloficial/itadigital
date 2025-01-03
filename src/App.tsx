import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Technologies } from './components/Technologies';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { PrototypeOffer } from './components/PrototypeOffer';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LoginForm } from './components/auth/LoginForm';
import { ClientSignupForm } from './components/auth/ClientSignupForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { ClientsPage } from './pages/admin/ClientsPage';
import { useAuthStore } from './lib/store';
import { initializeAuth } from './lib/auth';

function App() {
  const { user, userType } = useAuthStore();

  useEffect(() => {
    // Initialize authentication
    const unsubscribe = initializeAuth();
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Hero />
              <Services />
              <Technologies />
              <Projects />
              <PrototypeOffer />
              <About />
              <Contact />
            </main>
            <Footer />
          </div>
        } />
        
        <Route path="/admin-login" element={
          user && userType === 'admin' ? <Navigate to="/admin" /> : <LoginForm type="admin" />
        } />
        
        <Route path="/login" element={
          user && userType === 'client' ? <Navigate to="/dashboard" /> : <LoginForm type="client" />
        } />
        
        <Route path="/signup" element={
          user ? <Navigate to="/dashboard" /> : <ClientSignupForm />
        } />

        <Route path="/admin" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/clients" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/empresas" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/servicos" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/tickets" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/chat" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/faq" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/admin/settings" element={
          user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />
        } />

        <Route path="/dashboard" element={
          user && userType === 'client' ? <ClientDashboard /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;