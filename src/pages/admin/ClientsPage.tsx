import React from 'react';
import { ClientList } from '../../components/admin/ClientList';

export function ClientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ClientList />
    </div>
  );
}
