import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, addDoc, serverTimestamp, where, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Ticket, MessageSquare, X, Send, Clock, Tag } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

interface TicketData {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastResponseId?: string;
}

interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  isAdmin: boolean;
  userEmail: string;
  createdAt: Timestamp;
}

export function TicketManagement() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketResponses(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const ticketsQuery = query(
        collection(db, 'tickets'),
        orderBy('createdAt', 'desc')
      );
      const ticketSnapshot = await getDocs(ticketsQuery);
      const ticketList = ticketSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TicketData[];
      
      // Filtrar os tickets com base no status selecionado
      const filteredTickets = filterStatus === 'all' 
        ? ticketList 
        : ticketList.filter(ticket => ticket.status === filterStatus);
      
      setTickets(filteredTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketResponses = async (ticketId: string) => {
    try {
      const responsesQuery = query(
        collection(db, 'ticketResponses'),
        where('ticketId', '==', ticketId),
        orderBy('createdAt', 'asc')
      );
      const responseSnapshot = await getDocs(responsesQuery);
      const responseList = responseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TicketResponse[];
      setResponses(responseList);
    } catch (error) {
      console.error('Error fetching ticket responses:', error);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'closed') => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Se o ticket foi fechado, adicione uma resposta do sistema
      if (newStatus === 'closed') {
        await addDoc(collection(db, 'ticketResponses'), {
          ticketId,
          message: 'Ticket fechado pelo administrador',
          isAdmin: true,
          userEmail: user?.email || 'admin@itadigital.com',
          createdAt: serverTimestamp()
        });
      }
      
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
        fetchTicketResponses(ticketId);
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newResponse.trim() || !user?.email) {
      console.error('Cannot send response: Missing required data');
      return;
    }

    try {
      // Adiciona a resposta
      const responseData = {
        ticketId: selectedTicket.id,
        message: newResponse,
        isAdmin: true,
        userEmail: user.email,
        createdAt: serverTimestamp()
      };
      
      const responseRef = await addDoc(collection(db, 'ticketResponses'), responseData);

      // Atualiza o ticket
      const ticketRef = doc(db, 'tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        updatedAt: serverTimestamp(),
        status: selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status,
        lastResponseId: responseRef.id
      });

      setNewResponse('');
      
      // Atualiza o ticket selecionado com o novo status
      if (selectedTicket.status === 'open') {
        setSelectedTicket(prev => prev ? { ...prev, status: 'in_progress' } : null);
      }
      
      // Atualiza as respostas e a lista de tickets
      await Promise.all([
        fetchTicketResponses(selectedTicket.id),
        fetchTickets()
      ]);
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="flex h-full">
      {/* Tickets List */}
      <div className={`bg-white rounded-lg shadow ${selectedTicket ? 'w-1/3' : 'w-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Ticket className="h-6 w-6 mr-2" />
              Tickets
            </h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tickets found
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500">{ticket.userEmail}</div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{ticket.description}</div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(ticket.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Tag className={`h-4 w-4 mr-1 ${getPriorityColor(ticket.priority)}`} />
                      {ticket.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details */}
      {selectedTicket && (
        <div className="w-2/3 bg-white rounded-lg shadow ml-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{selectedTicket.title}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      handleStatusChange(selectedTicket.id, e.target.value as 'open' | 'in_progress' | 'closed')
                    }
                    className="ml-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Priority:</span>
                  <span className={`ml-2 font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{selectedTicket.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className={`p-4 rounded-lg ${
                    response.isAdmin ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{response.userEmail}</span>
                    <span className="text-sm text-gray-500">{formatDate(response.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{response.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendResponse} className="flex items-start space-x-4">
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 min-h-[100px] rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newResponse.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
