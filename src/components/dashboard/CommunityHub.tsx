'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ChatRoom {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: string[];
  onlineMembers: string[];
  maxMembers: number;
  isPrivate: boolean;
  adminId: string;
  adminUsername: string;
  lastMessage?: string;
  lastMessageUser?: string;
  lastMessageTime?: string;
  createdAt: string;
}

const categories = ["All", "Gaming", "VR", "Tech", "Racing", "Art", "Crypto", "General"];

export default function CommunityHub() {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    category: 'Gaming',
    maxMembers: 100,
    isPrivate: false,
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchChatRooms();
  }, [selectedCategory]);

  const fetchChatRooms = async () => {
    try {
      const url = selectedCategory === 'All' 
        ? '/api/chat-rooms' 
        : `/api/chat-rooms?category=${selectedCategory}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setChatRooms(data);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!session?.user) return;

    const room = chatRooms.find(r => r._id === roomId);
    if (!room) return;

    let password = '';
    if (room.isPrivate) {
      password = prompt('Enter room password:') || '';
    }

    try {
      const response = await fetch('/api/chat-rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, action: 'join', password }),
      });

      if (response.ok) {
        const result = await response.json();
        setChatRooms(chatRooms.map(r => 
          r._id === roomId 
            ? { ...r, members: result.members, onlineMembers: result.onlineMembers }
            : r
        ));
        setSelectedRoom(roomId);
        alert('Successfully joined the room!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room');
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/chat-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...roomData,
          password: roomData.isPrivate ? roomData.password : undefined
        }),
      });

      if (response.ok) {
        const newRoom = await response.json();
        setChatRooms([newRoom, ...chatRooms]);
        setRoomData({
          name: '',
          description: '',
          category: 'Gaming',
          maxMembers: 100,
          isPrivate: false,
          password: ''
        });
        setShowCreateRoom(false);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'No recent activity';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-purple">Community Hub</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowVoiceChat(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
          >
            Voice Chat
          </button>
          <button 
            onClick={() => setShowCreateRoom(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple"
          >
            Create Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chatrooms */}
        <div className="lg:col-span-2">
          {/* Category Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-black neon-border-purple'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Chatrooms List */}
          <div className="glass rounded-xl p-6 neon-border-purple">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-purple">Active Chatrooms</h3>
            <div className="space-y-4">
              {chatRooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-xl text-gray-400">No active chatrooms</p>
                  <p className="text-sm text-gray-500">Create a room to start chatting!</p>
                </div>
              ) : (
                chatRooms.map((room, index) => (
                  <div 
                    key={room._id} 
                    className="bg-black bg-opacity-30 rounded-lg p-4 animate-slide-in hover:scale-105 transition-transform duration-300 cursor-pointer group" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleJoinRoom(room._id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-200">
                          #{room.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                          <span className="text-sm text-green-400">{room.onlineMembers.length} online</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-cyan-400 to-pink-500 text-black text-xs px-2 py-1 rounded font-semibold">
                        {room.category}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{room.members.length} members</span>
                      <span>{formatTime(room.lastMessageTime)}</span>
                    </div>
                    
                    {room.lastMessage && (
                      <div className="mt-2 text-sm text-gray-300">
                        <span className="text-purple-400 font-semibold">{room.lastMessageUser}:</span> {room.lastMessage}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Admin: {room.adminUsername}</span>
                      {room.isPrivate && (
                        <span className="text-xs text-gray-500">🔒 Private</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass rounded-xl p-6 neon-border-green">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-green">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowCreateRoom(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple"
              >
                Create New Chatroom
              </button>
              <button 
                onClick={fetchChatRooms}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 neon-border-cyan"
              >
                Refresh Rooms
              </button>
              <button 
                onClick={() => setShowVoiceChat(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
              >
                Start Voice Chat
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="glass rounded-xl p-6 neon-border-pink">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-pink">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Rooms</span>
                <span className="text-cyan-400 neon-glow-cyan font-bold">{chatRooms.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Now</span>
                <span className="text-green-400 neon-glow-green font-bold">
                  {chatRooms.reduce((sum, room) => sum + room.onlineMembers.length, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Members</span>
                <span className="text-purple-400 neon-glow-purple font-bold">
                  {chatRooms.reduce((sum, room) => sum + room.members.length, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Categories</span>
                <span className="text-pink-400 neon-glow-pink font-bold">{categories.length - 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-8 max-w-md w-full mx-4 neon-border-purple">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white neon-glow-purple">Create Chatroom</h3>
              <button 
                onClick={() => setShowCreateRoom(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Name</label>
                <input 
                  type="text" 
                  value={roomData.name}
                  onChange={(e) => setRoomData({...roomData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  placeholder="Enter room name..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select 
                  value={roomData.category}
                  onChange={(e) => setRoomData({...roomData, category: e.target.value})}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Members</label>
                <input 
                  type="number"
                  value={roomData.maxMembers}
                  onChange={(e) => setRoomData({...roomData, maxMembers: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  min="2"
                  max="1000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea 
                  value={roomData.description}
                  onChange={(e) => setRoomData({...roomData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  rows={3}
                  placeholder="Describe your chatroom..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={roomData.isPrivate}
                  onChange={(e) => setRoomData({...roomData, isPrivate: e.target.checked})}
                  className="rounded"
                />
                <label className="text-sm text-gray-300">Private Room</label>
              </div>
              
              {roomData.isPrivate && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input 
                    type="password"
                    value={roomData.password}
                    onChange={(e) => setRoomData({...roomData, password: e.target.value})}
                    className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    placeholder="Enter password..."
                    required
                  />
                </div>
              )}
              
              <div className="flex space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-black font-semibold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 neon-border-purple"
                >
                  {submitting ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice Chat Modal */}
      {showVoiceChat && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-8 max-w-md w-full mx-4 neon-border-green">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse-slow">🎤</div>
              <h3 className="text-2xl font-bold text-white mb-4 neon-glow-green">Voice Chat</h3>
              <p className="text-gray-400 mb-6">
                Voice chat functionality will be implemented here. Users can join voice channels and communicate with other members.
              </p>
              <button 
                onClick={() => setShowVoiceChat(false)}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}