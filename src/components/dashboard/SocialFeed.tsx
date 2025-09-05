'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the Post interface
interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  liked: boolean;
  userLikes: string[];
}

// Enhanced demo data for social feed
const socialFeedPosts: Post[] = [
  {
    id: 1,
    user: "CyberGamer",
    avatar: "🎮",
    content: "Just finished an epic battle in Cyberpunk Arena! The new update is absolutely insane 🔥",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    likes: 1247,
    comments: 89,
    shares: 23,
    time: "2m ago",
    liked: false,
    userLikes: []
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
    time: "15m ago",
    liked: false,
    userLikes: []
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
    time: "1h ago",
    liked: false,
    userLikes: []
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
    time: "3h ago",
    liked: false,
    userLikes: []
  }
];

export default function SocialFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>(socialFeedPosts);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [comments, setComments] = useState<{[key: number]: string[]}>({});

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.liked;
        return {
          ...post,
          liked: !isLiked,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          userLikes: isLiked 
            ? post.userLikes.filter(user => user !== session?.user?.name)
            : [...post.userLikes, session?.user?.name || 'Anonymous']
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: number) => {
    const commentText = prompt('Add a comment:');
    if (commentText && commentText.trim()) {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), `${session?.user?.name || 'Anonymous'}: ${commentText.trim()}`]
      }));
      
      // Update post comment count
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
    }
  };

  const handleShare = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (navigator.share) {
        navigator.share({
          title: `Post by ${post.user}`,
          text: post.content,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${post.content} - Posted by ${post.user} on GenZPlug`);
        alert('Post content copied to clipboard!');
      }
      
      // Update share count
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, shares: p.shares + 1 }
          : p
      ));
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !session?.user) return;

    const newPostObj: Post = {
      id: Date.now(),
      user: session.user.name || 'Anonymous',
      avatar: '👤',
      content: newPost.trim(),
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      time: 'Just now',
      liked: false,
      userLikes: []
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setShowCreatePost(false);
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-cyan">Social Feed</h2>
        <button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 neon-border-cyan"
        >
          {showCreatePost ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && session && (
        <div className="glass rounded-xl p-6 mb-8 neon-border-cyan">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center text-lg">
                {session.user?.name?.charAt(0) || '👤'}
              </div>
              <div>
                <h3 className="font-semibold text-white">{session.user?.name || 'Anonymous'}</h3>
                <p className="text-sm text-gray-400">Share your thoughts...</p>
              </div>
            </div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-700"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {newPost.length}/500 characters
              </span>
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
      
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
                <p className="text-sm text-gray-400">{formatTime(post.time)}</p>
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
                  className={`flex items-center space-x-2 transition-colors duration-200 group ${
                    post.liked ? 'text-red-400' : 'hover:text-red-400'
                  }`}
                >
                  <span className={`group-hover:scale-110 transition-transform duration-200 ${
                    post.liked ? 'animate-pulse' : ''
                  }`}>
                    {post.liked ? '❤️' : '🤍'}
                  </span>
                  <span className={`transition-colors duration-200 ${
                    post.liked ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'
                  }`}>
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

            {/* Comments Section */}
            {comments[post.id] && comments[post.id].length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="space-y-2">
                  {comments[post.id].map((comment, commentIndex) => (
                    <div key={commentIndex} className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3">
                      {comment}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
