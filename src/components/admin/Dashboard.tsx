import React, { useState } from 'react';
import { TicketManagement } from './TicketManagement';
import { EmpresaManagement } from './EmpresaManagement';
import { NotaFiscalEmission } from './NotaFiscalEmission';
import { Building2, FileText, MessageSquare } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'empresas' | 'notas'>('tickets');

  const tabs = [
    { id: 'tickets', name: 'Tickets', icon: MessageSquare },
    { id: 'empresas', name: 'Empresas', icon: Building2 },
    { id: 'notas', name: 'Notas Fiscais', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mt-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    `}
                  >
                    <Icon className={`
                      ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                      -ml-0.5 mr-2 h-5 w-5
                    `} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="py-4">
            {activeTab === 'tickets' && <TicketManagement />}
            {activeTab === 'empresas' && <EmpresaManagement />}
            {activeTab === 'notas' && <NotaFiscalEmission />}
          </div>
        </div>
      </div>
    </div>
  );
}
