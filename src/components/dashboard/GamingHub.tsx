'use client';

import { useState } from 'react';

const gameCategories = [
  { id: 'racing', name: 'Racing Games', icon: '🏎️', count: 24, color: 'from-green-400 to-cyan-500' },
  { id: 'action', name: 'Action Games', icon: '⚔️', count: 18, color: 'from-red-400 to-pink-500' },
  { id: 'puzzle', name: 'Puzzle Games', icon: '🧩', count: 32, color: 'from-blue-400 to-purple-500' },
  { id: 'strategy', name: 'Strategy Games', icon: '🎯', count: 15, color: 'from-yellow-400 to-orange-500' },
  { id: 'arcade', name: 'Arcade Games', icon: '🕹️', count: 28, color: 'from-purple-400 to-pink-500' },
  { id: 'rpg', name: 'RPG Games', icon: '🗡️', count: 12, color: 'from-indigo-400 to-blue-500' }
];

const featuredGames = [
  {
    id: 1,
    name: "Cyberpunk Racing",
    players: 1247,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
    category: "Racing"
  },
  {
    id: 2,
    name: "Neon Warriors",
    players: 892,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
    category: "Action"
  },
  {
    id: 3,
    name: "Digital Puzzle",
    players: 567,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
    category: "Puzzle"
  }
];

const liveStats = {
  activePlayers: 12847,
  gamesAvailable: 156,
  tournamentsToday: 23,
  userRank: 1247,
  totalPlayTime: "2.5h",
  achievements: 15
};

export default function GamingHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGameCenterOpen, setIsGameCenterOpen] = useState(false);

  const handleLaunchGame = (gameId: number) => {
    // Placeholder for game launch functionality
    console.log(`Launching game ${gameId}`);
    setIsGameCenterOpen(true);
  };

  const handleJoinTournament = () => {
    // Placeholder for tournament functionality
    console.log('Joining tournament');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-green">Gaming Hub</h2>
        <button 
          onClick={() => setIsGameCenterOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
        >
          Launch Game Center
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Categories */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-6 neon-glow-cyan">Game Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gameCategories.map((category, index) => (
              <div 
                key={category.id}
                className="glass rounded-xl p-6 neon-border-green animate-slide-in hover:scale-105 transition-transform duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h4 className="text-lg font-semibold text-white text-center mb-2">{category.name}</h4>
                <p className="text-sm text-gray-400 text-center">{category.count} games</p>
              </div>
            ))}
          </div>

          {/* Featured Games */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-pink">Featured Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGames.map((game, index) => (
                <div 
                  key={game.id}
                  className="glass rounded-xl overflow-hidden neon-border-pink animate-slide-in hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={game.image} 
                      alt={game.name} 
                      className="w-full h-32 object-cover" 
                    />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black text-xs px-2 py-1 rounded font-semibold">
                      {game.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-2">{game.name}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>{game.players} players</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{game.rating}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleLaunchGame(game.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink"
                    >
                      Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Gaming Stats */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-6 neon-border-purple">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-purple">Live Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Players</span>
                <span className="text-green-400 neon-glow-green font-bold">
                  {liveStats.activePlayers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games Available</span>
                <span className="text-cyan-400 neon-glow-cyan font-bold">{liveStats.gamesAvailable}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tournaments Today</span>
                <span className="text-pink-400 neon-glow-pink font-bold">{liveStats.tournamentsToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Your Rank</span>
                <span className="text-purple-400 neon-glow-purple font-bold">#{liveStats.userRank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Play Time</span>
                <span className="text-blue-400 neon-glow-blue font-bold">{liveStats.totalPlayTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Achievements</span>
                <span className="text-yellow-400 neon-glow font-bold">{liveStats.achievements}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl p-6 neon-border-cyan">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-cyan">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={handleJoinTournament}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 neon-border-purple"
              >
                Join Tournament
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 neon-border-cyan">
                Find Players
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green">
                View Leaderboard
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink">
                Create Party
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-xl p-6 neon-border-green">
            <h3 className="text-2xl font-bold text-white mb-6 neon-glow-green">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                <span className="text-gray-300">Won &quot;Cyberpunk Racing&quot;</span>
                <span className="text-gray-500">2m ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></div>
                <span className="text-gray-300">Achievement unlocked: Speed Demon</span>
                <span className="text-gray-500">15m ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse-slow"></div>
                <span className="text-gray-300">Joined &quot;Neon Warriors&quot; tournament</span>
                <span className="text-gray-500">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Center Modal Placeholder */}
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
