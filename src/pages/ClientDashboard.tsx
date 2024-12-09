import React, { useState } from 'react';
import { signOut } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, LogOut, HelpCircle } from 'lucide-react';
import { Chat } from '../components/support/Chat';
import { Tickets } from '../components/support/Tickets';
import { FAQ } from '../components/support/FAQ';

export function ClientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="https://cliente.itadigital.com.br/logo.png" 
                alt="ITA Digital" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Seção de Projetos */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Meus Projetos</h2>
              </div>
              <div className="text-gray-500">
                Lista de projetos será implementada em breve...
              </div>
            </div>
          </div>

          {/* Seção de Suporte */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Suporte</h2>
            </div>

            {/* Tabs de Suporte */}
            <div className="border-b border-gray-200">
              <div className="sm:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="chat">Chat de Suporte</option>
                  <option value="tickets">Tickets</option>
                  <option value="faq">Base de Conhecimento</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`${
                      activeTab === 'chat'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } flex whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Chat de Suporte
                  </button>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className={`${
                      activeTab === 'tickets'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } flex whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Tickets
                  </button>
                  <button
                    onClick={() => setActiveTab('faq')}
                    className={`${
                      activeTab === 'faq'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } flex whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Base de Conhecimento
                  </button>
                </nav>
              </div>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="p-4">
              {activeTab === 'chat' && <Chat />}
              {activeTab === 'tickets' && <Tickets />}
              {activeTab === 'faq' && <FAQ />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}