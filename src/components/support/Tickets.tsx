import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../lib/store';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  timestamp: any;
}

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
  });
  
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      setTickets(newTickets);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !newTicket.title.trim() || !newTicket.description.trim()) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'tickets'), {
        ...newTicket,
        userId: user.uid,
        status: 'open',
        timestamp: serverTimestamp(),
      });
      setNewTicket({ title: '', description: '', priority: 'medium' });
      setShowNewTicketForm(false);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
    setIsLoading(false);
  };

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Tickets de Suporte</h2>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Ticket
        </button>
      </div>

      {showNewTicketForm && (
        <div className="p-4 border-b">
          <form onSubmit={createTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridade</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as Ticket['priority'] })}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewTicketForm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : 'Criar Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4">
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(ticket.status)}
                  <h3 className="text-lg font-medium">{ticket.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{ticket.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {ticket.timestamp?.toDate().toLocaleString()}
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Nenhum ticket encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
