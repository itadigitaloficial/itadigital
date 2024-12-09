import React from 'react';
import { Users, MessageSquare, HelpCircle, Ticket } from 'lucide-react';

export function Statistics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<Users className="h-8 w-8 text-blue-600" />}
        title="Total Users"
        value="0"
      />
      <StatCard
        icon={<Ticket className="h-8 w-8 text-green-600" />}
        title="Active Tickets"
        value="0"
      />
      <StatCard
        icon={<MessageSquare className="h-8 w-8 text-purple-600" />}
        title="Chat Sessions"
        value="0"
      />
      <StatCard
        icon={<HelpCircle className="h-8 w-8 text-orange-600" />}
        title="FAQ Articles"
        value="0"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}
