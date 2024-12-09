import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MessageSquare, User, Clock, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

interface ChatSession {
  id: string;
  userId: string;
  userEmail: string;
  status: 'active' | 'closed';
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
}

export function ChatManagement() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      const chatQuery = query(
        collection(db, 'chatSessions'),
        orderBy('updatedAt', 'desc')
      );
      const chatSnapshot = await getDocs(chatQuery);
      const sessionList = chatSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatSession[];
      setChatSessions(sessionList);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const handleChatClick = (session: ChatSession) => {
    setSelectedChat(session);
  };

  const handleCloseSession = async (sessionId: string) => {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      await updateDoc(sessionRef, {
        status: 'closed',
        updatedAt: new Date().toISOString(),
      });
      await fetchChatSessions();
    } catch (error) {
      console.error('Error closing chat session:', error);
    }
  };

  const getTimeDifference = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredSessions = selectedStatus === 'all'
    ? chatSessions
    : chatSessions.filter(session => session.status === selectedStatus);

  if (loading) {
    return <div className="text-center">Loading chat sessions...</div>;
  }

  return (
    <div className="flex h-full">
      {/* Chat Sessions List */}
      <div className={`bg-white rounded-lg shadow ${selectedChat ? 'w-1/3' : 'w-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Chat Sessions
            </h2>
            <div className="flex space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'closed')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Sessions</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleChatClick(session)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedChat?.id === session.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{session.userEmail}</div>
                      <div className="text-sm text-gray-500">ID: {session.userId}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      session.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 truncate">{session.lastMessage}</div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {getTimeDifference(session.lastMessageTime)}
                  </div>
                  {session.status === 'active' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseSession(session.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {selectedChat && (
        <div className="w-2/3 pl-6">
          <ChatInterface
            sessionId={selectedChat.id}
            userEmail={selectedChat.userEmail}
            onClose={handleCloseChat}
          />
        </div>
      )}
    </div>
  );
}
