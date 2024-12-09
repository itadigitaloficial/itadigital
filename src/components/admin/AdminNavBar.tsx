import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, Package, Settings, LogOut, LayoutDashboard, MessageSquare, HelpCircle, Ticket, Building2 } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

interface AdminNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'clients', name: 'Clientes', icon: Users, path: '/admin/clients' },
  { id: 'empresas', name: 'Empresas', icon: Building2, path: '/admin/empresas' },
  { id: 'servicos', name: 'Serviços', icon: Package, path: '/admin/servicos' },
  { id: 'tickets', name: 'Tickets', icon: Ticket, path: '/admin/tickets' },
  { id: 'chat', name: 'Chat', icon: MessageSquare, path: '/admin/chat' },
  { id: 'faq', name: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
  { id: 'settings', name: 'Configurações', icon: Settings, path: '/admin/settings' },
];

export function AdminNavBar({ activeTab, setActiveTab }: AdminNavBarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleNavigation = (item: typeof navItems[0]) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        <Link to="/admin" className="text-xl font-bold text-blue-600">
          ITA Digital
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="mt-5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md mb-1 ${
                activeTab === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {item.name}
            </button>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md mt-4"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </button>
      </nav>
    </div>
  );
}
