'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the Post interface
interface Post {
  _id: string;
  userId: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  userLikes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  likes: number;
  userLikes: string[];
  createdAt: string;
}

export default function SocialFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [comments, setComments] = useState<{[key: string]: Comment[]}>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!session?.user) return;

    const post = posts.find(p => p._id === postId);
    if (!post) return;

    const username = session.user.name || 'Anonymous';
    const isLiked = post.userLikes.includes(username);
    const action = isLiked ? 'unlike' : 'like';

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, action }),
      });

      if (response.ok) {
        const result = await response.json();
        setPosts(posts.map(p => 
          p._id === postId 
            ? { ...p, likes: result.likes, userLikes: result.userLikes }
            : p
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    const commentText = prompt('Add a comment:');
    if (!commentText || !commentText.trim() || !session?.user) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId, 
          content: commentText.trim() 
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }));
        
        // Update post comment count
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, comments: post.comments + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (post) {
      if (navigator.share) {
        navigator.share({
          title: `Post by ${post.username}`,
          text: post.content,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(`${post.content} - Posted by ${post.username} on GenZPlug`);
        alert('Post content copied to clipboard!');
      }
      
      // Update share count
      setPosts(posts.map(p => 
        p._id === postId 
          ? { ...p, shares: p.shares + 1 }
          : p
      ));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !session?.user || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: newPost.trim(),
          tags: []
        }),
      });

      if (response.ok) {
        const newPostData = await response.json();
        setPosts([newPostData, ...posts]);
        setNewPost('');
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
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

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

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
                disabled={!newPost.trim() || submitting}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-xl text-gray-400">No posts yet</p>
            <p className="text-sm text-gray-500">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div 
              key={post._id} 
              className="glass rounded-xl p-6 neon-border-cyan animate-slide-in hover:scale-105 transition-transform duration-300" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center text-xl animate-pulse-slow">
                  {post.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-white neon-glow-cyan">{post.username}</h3>
                  <p className="text-sm text-gray-400">{formatTime(post.createdAt)}</p>
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
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-2 transition-colors duration-200 group ${
                      post.userLikes.includes(session?.user?.name || '') ? 'text-red-400' : 'hover:text-red-400'
                    }`}
                  >
                    <span className={`group-hover:scale-110 transition-transform duration-200 ${
                      post.userLikes.includes(session?.user?.name || '') ? 'animate-pulse' : ''
                    }`}>
                      {post.userLikes.includes(session?.user?.name || '') ? '❤️' : '🤍'}
                    </span>
                    <span className={`transition-colors duration-200 ${
                      post.userLikes.includes(session?.user?.name || '') ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'
                    }`}>
                      {post.likes.toLocaleString()}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => handleComment(post._id)}
                    className="flex items-center space-x-2 hover:text-pink-400 transition-colors duration-200 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">💬</span>
                    <span className="text-gray-400 group-hover:text-pink-400 transition-colors duration-200">
                      {post.comments}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => handleShare(post._id)}
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
              {comments[post._id] && comments[post._id].length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="space-y-2">
                    {comments[post._id].map((comment) => (
                      <div key={comment._id} className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3">
                        <span className="font-semibold text-cyan-400">{comment.username}:</span> {comment.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
