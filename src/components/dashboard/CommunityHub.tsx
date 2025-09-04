'use client';

import { useState } from 'react';

// Demo data for community chatrooms
const chatrooms = [
  {
    id: 1,
    name: "Cyberpunk Gaming",
    members: 1247,
    online: 89,
    lastMessage: "Anyone up for a raid tonight?",
    lastUser: "GamingMaster",
    time: "2m ago",
    category: "Gaming",
    isActive: true
  },
  {
    id: 2,
    name: "VR Enthusiasts",
    members: 892,
    online: 45,
    lastMessage: "New VR game just dropped!",
    lastUser: "VRExplorer",
    time: "5m ago",
    category: "VR",
    isActive: true
  },
  {
    id: 3,
    name: "Tech Talk",
    members: 567,
    online: 23,
    lastMessage: "AI gaming is the future!",
    lastUser: "TechWizard",
    time: "12m ago",
    category: "Tech",
    isActive: false
  },
  {
    id: 4,
    name: "Neon Racing League",
    members: 2341,
    online: 156,
    lastMessage: "Championship race starting soon!",
    lastUser: "SpeedDemon",
    time: "1m ago",
    category: "Racing",
    isActive: true
  },
  {
    id: 5,
    name: "Digital Artists",
    members: 789,
    online: 34,
    lastMessage: "Check out my latest cyberpunk artwork",
    lastUser: "PixelArtist",
    time: "8m ago",
    category: "Art",
    isActive: true
  },
  {
    id: 6,
    name: "Crypto Gaming",
    members: 445,
    online: 67,
    lastMessage: "New NFT game marketplace launched",
    lastUser: "CryptoGamer",
    time: "15m ago",
    category: "Crypto",
    isActive: true
  }
];

const categories = ["All", "Gaming", "VR", "Tech", "Racing", "Art", "Crypto"];

const onlineFriends = [
  { id: 1, name: "GamingMaster", avatar: "🎮", status: "online", game: "Cyberpunk Racing" },
  { id: 2, name: "VRExplorer", avatar: "🥽", status: "online", game: "VR Chat" },
  { id: 3, name: "TechWizard", avatar: "🔮", status: "away", game: "Idle" },
  { id: 4, name: "SpeedDemon", avatar: "🏎️", status: "online", game: "Neon Racing" },
  { id: 5, name: "PixelArtist", avatar: "🎨", status: "online", game: "Digital Canvas" }
];

export default function CommunityHub() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  const filteredRooms = selectedCategory === "All" 
    ? chatrooms 
    : chatrooms.filter(room => room.category === selectedCategory);

  const handleJoinRoom = (roomId: number) => {
    setSelectedRoom(roomId);
    // Placeholder for joining room functionality
    console.log(`Joining room ${roomId}`);
  };

  const handleCreateRoom = () => {
    setShowCreateRoom(true);
  };

  const handleStartVoiceChat = () => {
    setShowVoiceChat(true);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-purple">Community Hub</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleStartVoiceChat}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
          >
            Voice Chat
          </button>
          <button 
            onClick={handleCreateRoom}
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
              {filteredRooms.map((room, index) => (
                <div 
                  key={room.id} 
                  className="bg-black bg-opacity-30 rounded-lg p-4 animate-slide-in hover:scale-105 transition-transform duration-300 cursor-pointer group" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleJoinRoom(room.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-200">
                        #{room.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${room.isActive ? 'bg-green-400 animate-pulse-slow' : 'bg-gray-500'}`}></div>
                        <span className="text-sm text-green-400">{room.online} online</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-cyan-400 to-pink-500 text-black text-xs px-2 py-1 rounded font-semibold">
                      {room.category}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{room.members} members</span>
                    <span>{room.time}</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-300">
                    <span className="text-purple-400 font-semibold">{room.lastUser}:</span> {room.lastMessage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Online Friends */}
          <div className="glass rounded-xl p-6 neon-border-cyan">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-cyan">Online Friends</h3>
            <div className="space-y-3">
              {onlineFriends.map((friend, index) => (
                <div key={friend.id} className="flex items-center space-x-3 p-3 bg-black bg-opacity-30 rounded-lg animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center text-lg">
                      {friend.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                      friend.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{friend.name}</p>
                    <p className="text-xs text-gray-400">{friend.game}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl p-6 neon-border-green">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-green">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple">
                Create New Chatroom
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 neon-border-cyan">
                Join Random Room
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green">
                Start Voice Chat
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink">
                Invite Friends
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="glass rounded-xl p-6 neon-border-pink">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-pink">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Members</span>
                <span className="text-cyan-400 neon-glow-cyan font-bold">12,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Now</span>
                <span className="text-green-400 neon-glow-green font-bold">2,341</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Chatrooms</span>
                <span className="text-purple-400 neon-glow-purple font-bold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Voice Channels</span>
                <span className="text-pink-400 neon-glow-pink font-bold">23</span>
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  placeholder="Enter room name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none">
                  <option>Gaming</option>
                  <option>VR</option>
                  <option>Tech</option>
                  <option>Racing</option>
                  <option>Art</option>
                  <option>Crypto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  rows={3}
                  placeholder="Describe your chatroom..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-black font-semibold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple">
                  Create Room
                </button>
              </div>
            </div>
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
