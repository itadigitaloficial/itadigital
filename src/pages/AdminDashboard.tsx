import React, { useState } from 'react';
import { AdminNavBar } from '../components/admin/AdminNavBar';
import { Statistics } from '../components/admin/Statistics';
import { UserManagement } from '../components/admin/UserManagement';
import { TicketManagement } from '../components/admin/TicketManagement';
import { FAQManagement } from '../components/admin/FAQManagement';
import { ChatManagement } from '../components/admin/ChatManagement';
import { Settings } from '../components/admin/Settings';
import { EmpresaManagement } from '../components/admin/EmpresaManagement';
import { ServicosManagement } from '../components/admin/ServicosManagement';
import { ClientList } from '../components/admin/ClientList';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'clients', name: 'Clients' },
    { id: 'users', name: 'Users' },
    { id: 'tickets', name: 'Tickets' },
    { id: 'empresas', name: 'Empresas' },
    { id: 'servicos', name: 'Serviços' },
    { id: 'chat', name: 'Chat' },
    { id: 'faq', name: 'FAQ' },
    { id: 'settings', name: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      
      <main className="flex-1 py-6 px-8">
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h1>
            <Statistics />
          </>
        )}
        
        {activeTab === 'clients' && <ClientList />}
        
        {activeTab === 'users' && <UserManagement />}
        
        {activeTab === 'tickets' && <TicketManagement />}
        
        {activeTab === 'empresas' && <EmpresaManagement />}
        
        {activeTab === 'servicos' && <ServicosManagement />}
        
        {activeTab === 'chat' && <ChatManagement />}
        
        {activeTab === 'faq' && <FAQManagement />}
        
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}