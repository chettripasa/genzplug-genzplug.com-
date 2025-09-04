'use client';

import { useState } from 'react';

// Demo data for social feed
const socialFeedPosts = [
  {
    id: 1,
    user: "CyberGamer",
    avatar: "🎮",
    content: "Just finished an epic battle in Cyberpunk Arena! The new update is absolutely insane 🔥",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    likes: 1247,
    comments: 89,
    shares: 23,
    time: "2m ago"
  },
  {
    id: 2,
    user: "TechVision",
    avatar: "👁️",
    content: "The future of VR gaming is here! Check out this amazing setup I just built 🥽",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop",
    likes: 892,
    comments: 156,
    shares: 45,
    time: "15m ago"
  },
  {
    id: 3,
    user: "NeonRider",
    avatar: "🏍️",
    content: "Racing through the digital neon streets! This game is everything I dreamed of 🏎️",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
    likes: 567,
    comments: 43,
    shares: 12,
    time: "1h ago"
  },
  {
    id: 4,
    user: "DigitalNomad",
    avatar: "🌐",
    content: "Exploring the metaverse with my new VR setup. The possibilities are endless! 🚀",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    likes: 2341,
    comments: 234,
    shares: 89,
    time: "3h ago"
  }
];

export default function SocialFeed() {
  const [posts, setPosts] = useState(socialFeedPosts);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: number) => {
    // Placeholder for comment functionality
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = (postId: number) => {
    // Placeholder for share functionality
    console.log(`Share post ${postId}`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-cyan">Social Feed</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 neon-border-cyan">
          Create Post
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            className="glass rounded-xl p-6 neon-border-cyan animate-slide-in hover:scale-105 transition-transform duration-300" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center text-xl animate-pulse-slow">
                {post.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-white neon-glow-cyan">{post.user}</h3>
                <p className="text-sm text-gray-400">{post.time}</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
            
            {post.image && (
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">❤️</span>
                  <span className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-200">
                    {post.likes.toLocaleString()}
                  </span>
                </button>
                
                <button 
                  onClick={() => handleComment(post.id)}
                  className="flex items-center space-x-2 hover:text-pink-400 transition-colors duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">💬</span>
                  <span className="text-gray-400 group-hover:text-pink-400 transition-colors duration-200">
                    {post.comments}
                  </span>
                </button>
                
                <button 
                  onClick={() => handleShare(post.id)}
                  className="flex items-center space-x-2 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">📤</span>
                  <span className="text-gray-400 group-hover:text-green-400 transition-colors duration-200">
                    {post.shares}
                  </span>
                </button>
              </div>
              
              <div className="text-xs text-gray-500">
                <span className="animate-pulse-slow">●</span> Live
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
