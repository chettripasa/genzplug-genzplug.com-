'use client';

import { useState } from 'react';

// Demo data for video hub
const videoHubVideos = [
  {
    id: 1,
    title: "Epic Cyberpunk Battle",
    creator: "GamingMaster",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
    views: "124K",
    likes: 8923,
    comments: 456,
    shares: 234,
    duration: "12:34",
    category: "Gaming"
  },
  {
    id: 2,
    title: "VR Gaming Setup Tour",
    creator: "TechReviewer",
    thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=200&fit=crop",
    views: "89K",
    likes: 5678,
    comments: 234,
    shares: 123,
    duration: "8:45",
    category: "Tech"
  },
  {
    id: 3,
    title: "Neon Racing Championship",
    creator: "SpeedDemon",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
    views: "67K",
    likes: 3456,
    comments: 189,
    shares: 89,
    duration: "15:22",
    category: "Racing"
  },
  {
    id: 4,
    title: "AI Gaming Revolution",
    creator: "FutureGamer",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
    views: "45K",
    likes: 2345,
    comments: 123,
    shares: 67,
    duration: "6:18",
    category: "AI"
  },
  {
    id: 5,
    title: "Metaverse Exploration",
    creator: "VirtualExplorer",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    views: "234K",
    likes: 15678,
    comments: 892,
    shares: 445,
    duration: "22:15",
    category: "VR"
  },
  {
    id: 6,
    title: "Neon City Nightlife",
    creator: "CyberpunkLife",
    thumbnail: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
    views: "178K",
    likes: 12345,
    comments: 678,
    shares: 334,
    duration: "18:42",
    category: "Lifestyle"
  }
];

const categories = ["All", "Gaming", "Tech", "Racing", "AI", "VR", "Lifestyle"];

export default function VideoHub() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState(videoHubVideos);

  const filteredVideos = selectedCategory === "All" 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const handleLike = (videoId: number) => {
    setVideos(videos.map(video => 
      video.id === videoId 
        ? { ...video, likes: video.likes + 1 }
        : video
    ));
  };

  const handlePlay = (videoId: number) => {
    // Placeholder for video playback functionality
    console.log(`Playing video ${videoId}`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-pink">Video Hub</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink">
          Upload Video
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-black neon-border-pink'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video, index) => (
          <div 
            key={video.id} 
            className="glass rounded-xl overflow-hidden neon-border-pink animate-slide-in hover:scale-105 transition-transform duration-300 group" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded neon-border-cyan">
                {video.duration}
              </div>
              
              {/* Play Button */}
              <button 
                onClick={() => handlePlay(video.id)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-2xl animate-pulse-slow">
                  ▶️
                </div>
              </button>
              
              {/* Category Badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black text-xs px-2 py-1 rounded font-semibold">
                {video.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors duration-200">
                {video.title}
              </h3>
              <p className="text-sm text-gray-400 mb-3 neon-glow-cyan">{video.creator}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{video.views} views</span>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleLike(video.id)}
                    className="flex items-center space-x-1 hover:text-pink-400 transition-colors duration-200"
                  >
                    <span>❤️</span>
                    <span>{video.likes.toLocaleString()}</span>
                  </button>
                  <span>💬 {video.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink">
          Load More Videos
        </button>
      </div>
    </div>
  );
}
