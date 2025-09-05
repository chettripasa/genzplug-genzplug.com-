'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface GameRoom {
  _id: string;
  name: string;
  description: string;
  gameType: string;
  maxPlayers: number;
  currentPlayers: number;
  players: string[];
  hostId: string;
  hostUsername: string;
  status: 'waiting' | 'playing' | 'finished';
  isPrivate: boolean;
  settings: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
    customRules?: string;
  };
  createdAt: string;
}

const gameTypes = ["All", "Cyberpunk Arena", "VR Racing", "Neon Battle", "AI Challenge", "Metaverse Quest"];

export default function GamingHub() {
  const { data: session } = useSession();
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [selectedGameType, setSelectedGameType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    gameType: 'Cyberpunk Arena',
    maxPlayers: 4,
    isPrivate: false,
    password: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });
  const [submitting, setSubmitting] = useState(false);
  const [isGameCenterOpen, setIsGameCenterOpen] = useState(false);

  useEffect(() => {
    fetchGameRooms();
  }, [selectedGameType]);

  const fetchGameRooms = async () => {
    try {
      const url = selectedGameType === 'All' 
        ? '/api/game-rooms' 
        : `/api/game-rooms?gameType=${selectedGameType}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setGameRooms(data);
      }
    } catch (error) {
      console.error('Error fetching game rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!session?.user) return;

    const room = gameRooms.find(r => r._id === roomId);
    if (!room) return;

    let password = '';
    if (room.isPrivate) {
      password = prompt('Enter room password:') || '';
    }

    try {
      const response = await fetch('/api/game-rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, action: 'join', password }),
      });

      if (response.ok) {
        const result = await response.json();
        setGameRooms(gameRooms.map(r => 
          r._id === roomId 
            ? { ...r, currentPlayers: result.currentPlayers, players: result.players }
            : r
        ));
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
      const response = await fetch('/api/game-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...roomData,
          settings: {
            difficulty: roomData.difficulty
          }
        }),
      });

      if (response.ok) {
        const newRoom = await response.json();
        setGameRooms([newRoom, ...gameRooms]);
        setRoomData({
          name: '',
          description: '',
          gameType: 'Cyberpunk Arena',
          maxPlayers: 4,
          isPrivate: false,
          password: '',
          difficulty: 'medium'
        });
        setShowCreateRoom(false);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-green-400';
      case 'playing': return 'text-yellow-400';
      case 'finished': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return '⏳';
      case 'playing': return '🎮';
      case 'finished': return '🏁';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-green">Gaming Hub</h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowCreateRoom(!showCreateRoom)}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
          >
            {showCreateRoom ? 'Cancel' : 'Create Room'}
          </button>
          <button 
            onClick={() => setIsGameCenterOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple"
          >
            Launch Game Center
          </button>
        </div>
      </div>

      {/* Create Room Form */}
      {showCreateRoom && session && (
        <div className="glass rounded-xl p-6 mb-8 neon-border-green">
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Create Game Room</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Room Name"
                value={roomData.name}
                onChange={(e) => setRoomData({...roomData, name: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
                required
              />
              <select
                value={roomData.gameType}
                onChange={(e) => setRoomData({...roomData, gameType: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              >
                {gameTypes.slice(1).map(gameType => (
                  <option key={gameType} value={gameType}>{gameType}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Max Players"
                value={roomData.maxPlayers}
                onChange={(e) => setRoomData({...roomData, maxPlayers: parseInt(e.target.value)})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
                min="2"
                max="20"
                required
              />
              <select
                value={roomData.difficulty}
                onChange={(e) => setRoomData({...roomData, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <textarea
              placeholder="Room Description"
              value={roomData.description}
              onChange={(e) => setRoomData({...roomData, description: e.target.value})}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              rows={3}
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={roomData.isPrivate}
                  onChange={(e) => setRoomData({...roomData, isPrivate: e.target.checked})}
                  className="rounded"
                />
                <span>Private Room</span>
              </label>
              {roomData.isPrivate && (
                <input
                  type="password"
                  placeholder="Room Password"
                  value={roomData.password}
                  onChange={(e) => setRoomData({...roomData, password: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {submitting ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>
      )}

      {/* Game Type Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {gameTypes.map((gameType) => (
          <button
            key={gameType}
            onClick={() => setSelectedGameType(gameType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedGameType === gameType
                ? 'bg-gradient-to-r from-green-400 to-cyan-500 text-black neon-glow-green'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {gameType}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Rooms */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-6 neon-glow-cyan">Active Game Rooms</h3>
          <div className="space-y-4">
            {gameRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-xl text-gray-400">No active rooms</p>
                <p className="text-sm text-gray-500">Create a room to start playing!</p>
              </div>
            ) : (
              gameRooms.map((room, index) => (
                <div 
                  key={room._id} 
                  className="glass rounded-xl p-6 neon-border-green animate-slide-in hover:scale-105 transition-transform duration-300" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                        🎮
                      </div>
                      <div>
                        <h4 className="font-semibold text-white neon-glow-green">{room.name}</h4>
                        <p className="text-sm text-gray-400">{room.gameType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center space-x-2 ${getStatusColor(room.status)}`}>
                        <span>{getStatusIcon(room.status)}</span>
                        <span className="font-semibold">{room.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{formatTime(room.createdAt)}</p>
                    </div>
                  </div>
                  
                  {room.description && (
                    <p className="text-gray-300 mb-4">{room.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-gray-400">
                        👥 {room.currentPlayers}/{room.maxPlayers} players
                      </span>
                      <span className="text-gray-400">
                        🎯 {room.settings.difficulty}
                      </span>
                      {room.isPrivate && (
                        <span className="text-gray-400">🔒 Private</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Host: {room.hostUsername}</span>
                      <button 
                        onClick={() => handleJoinRoom(room._id)}
                        disabled={room.currentPlayers >= room.maxPlayers || room.status !== 'waiting'}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Gaming Stats */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-6 neon-border-purple">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-purple">Live Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Rooms</span>
                <span className="text-green-400 neon-glow-green font-bold">
                  {gameRooms.filter(r => r.status === 'waiting').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Playing Now</span>
                <span className="text-cyan-400 neon-glow-cyan font-bold">
                  {gameRooms.filter(r => r.status === 'playing').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Players</span>
                <span className="text-pink-400 neon-glow-pink font-bold">
                  {gameRooms.reduce((sum, room) => sum + room.currentPlayers, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Game Types</span>
                <span className="text-purple-400 neon-glow-purple font-bold">
                  {gameTypes.length - 1}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl p-6 neon-border-cyan">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-cyan">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowCreateRoom(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple"
              >
                Create Room
              </button>
              <button 
                onClick={fetchGameRooms}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 neon-border-cyan"
              >
                Refresh Rooms
              </button>
              <button 
                onClick={() => setIsGameCenterOpen(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
              >
                Game Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Center Modal */}
      {isGameCenterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-8 max-w-2xl w-full mx-4 neon-border-green">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse-slow">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-4 neon-glow-green">Game Center</h3>
              <p className="text-gray-400 mb-6">
                Browser games functionality will be implemented here. Players can launch games directly in the browser.
              </p>
              <button 
                onClick={() => setIsGameCenterOpen(false)}
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