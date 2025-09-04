'use client';

import { useState } from 'react';
import LiveChat from '@/components/LiveChat';
import GameRoom from '@/components/GameRoom';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'games' | 'events'>('chat');
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [selectedGame, setSelectedGame] = useState('puzzle');

  const chatRooms = [
    { id: 'general', name: 'General Chat', description: 'General discussion' },
    { id: 'gaming', name: 'Gaming', description: 'Gaming discussions' },
    { id: 'tech', name: 'Tech Talk', description: 'Technology discussions' },
    { id: 'random', name: 'Random', description: 'Random topics' },
  ];

  const gameTypes = [
    { id: 'puzzle', name: 'Puzzle Challenge', description: 'Brain teasers and puzzles' },
    { id: 'racing', name: 'Speed Racing', description: 'Fast-paced racing games' },
    { id: 'strategy', name: 'Strategic Battle', description: 'Strategy and tactics' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Community Hub
          </h1>
          <p className="text-gray-400 text-lg">
            Connect, chat, and play with the GenZPlug community
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💬 Live Chat
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎮 Multiplayer Games
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📅 Events
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
              {activeTab === 'chat' && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Chat Rooms</h3>
                  <div className="space-y-2">
                    {chatRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedRoom === room.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium">{room.name}</div>
                        <div className="text-sm opacity-75">{room.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'games' && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Game Types</h3>
                  <div className="space-y-2">
                    {gameTypes.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedGame === game.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium">{game.name}</div>
                        <div className="text-sm opacity-75">{game.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-purple-400 font-medium">Gaming Tournament</div>
                      <div className="text-xs text-gray-400">Dec 15, 2024</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-purple-400 font-medium">Community Meetup</div>
                      <div className="text-xs text-gray-400">Dec 20, 2024</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-sm text-purple-400 font-medium">Tech Workshop</div>
                      <div className="text-xs text-gray-400">Dec 25, 2024</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'chat' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {chatRooms.find(r => r.id === selectedRoom)?.name}
                  </h2>
                  <p className="text-gray-400">
                    {chatRooms.find(r => r.id === selectedRoom)?.description}
                  </p>
                </div>
                <LiveChat roomId={selectedRoom} />
              </div>
            )}

            {activeTab === 'games' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {gameTypes.find(g => g.id === selectedGame)?.name}
                  </h2>
                  <p className="text-gray-400">
                    {gameTypes.find(g => g.id === selectedGame)?.description}
                  </p>
                </div>
                <GameRoom 
                  roomId={`${selectedGame}-room-1`} 
                  gameType={selectedGame as 'puzzle' | 'racing' | 'strategy'} 
                />
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Community Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="text-3xl mb-4">🏆</div>
                      <h3 className="text-white font-semibold mb-2">Gaming Tournament</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Join our monthly gaming tournament and compete for prizes!
                      </p>
                      <div className="text-sm text-gray-500 mb-4">
                        <div>📅 Dec 15, 2024</div>
                        <div>⏰ 7:00 PM EST</div>
                        <div>👥 50+ participants</div>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                        Register Now
                      </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="text-3xl mb-4">🤝</div>
                      <h3 className="text-white font-semibold mb-2">Community Meetup</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Connect with fellow gamers and developers in person!
                      </p>
                      <div className="text-sm text-gray-500 mb-4">
                        <div>📅 Dec 20, 2024</div>
                        <div>⏰ 6:00 PM EST</div>
                        <div>📍 Virtual Event</div>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                        Join Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
