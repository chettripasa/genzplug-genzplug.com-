'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/lib/socket-client';


interface LiveChatProps {
  roomId?: string;
  className?: string;
}

export default function LiveChat({ roomId = 'general', className = '' }: LiveChatProps) {
  const { data: session } = useSession();
  const { 
    isConnected, 
    chatMessages, 
    joinChatRoom, 
    sendMessage 
  } = useSocket();
  
  const [message, setMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConnected) {
      joinChatRoom(roomId);
    }
  }, [isConnected, roomId, joinChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session?.user) return;

    sendMessage({
      userId: session.user.id || 'anonymous',
      username: session.user.name || 'Anonymous',
      message: message.trim(),
      roomId
    });

    setMessage('');
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!session) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-400">
          Please sign in to join the chat
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-lg flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <h3 className="text-white font-semibold">Live Chat</h3>
          <span className="text-sm text-gray-400">#{roomId}</span>
        </div>
        <div className="text-xs text-gray-400">
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className="flex space-x-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">{msg.username}</span>
                  <span className="text-gray-500 text-xs">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-gray-300 text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
