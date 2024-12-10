import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, FileText, Users, Briefcase, Settings, LogOut, Layers } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: Briefcase, label: 'Empresas', path: '/admin/empresas' },
    { icon: Layers, label: 'Serviços', path: '/admin/servicos' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Layout className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold">Painel Administrativo</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={signOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="col-span-12 sm:col-span-3 lg:col-span-2">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon 
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`} 
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Conteúdo Principal */}
            <main className="col-span-12 sm:col-span-9 lg:col-span-10">
              <div className="bg-white shadow rounded-lg">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
