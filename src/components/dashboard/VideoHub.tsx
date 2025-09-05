'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Video {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  userLikes: string[];
  category: string;
  tags: string[];
  createdAt: string;
}

const categories = ["All", "Gaming", "Tech", "Racing", "AI", "VR", "Lifestyle"];

export default function VideoHub() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: '',
    category: 'Gaming',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      const url = selectedCategory === 'All' 
        ? '/api/videos' 
        : `/api/videos?category=${selectedCategory}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    if (!session?.user) return;

    const video = videos.find(v => v._id === videoId);
    if (!video) return;

    const username = session.user.name || 'Anonymous';
    const isLiked = video.userLikes.includes(username);
    const action = isLiked ? 'unlike' : 'like';

    try {
      const response = await fetch('/api/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, action }),
      });

      if (response.ok) {
        const result = await response.json();
        setVideos(videos.map(v => 
          v._id === videoId 
            ? { ...v, likes: result.likes, userLikes: result.userLikes }
            : v
        ));
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...uploadData,
          tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      });

      if (response.ok) {
        const newVideo = await response.json();
        setVideos([newVideo, ...videos]);
        setUploadData({
          title: '',
          description: '',
          thumbnail: '',
          videoUrl: '',
          duration: '',
          category: 'Gaming',
          tags: ''
        });
        setShowUploadForm(false);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
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
        <h2 className="text-3xl font-bold neon-glow-pink">Video Hub</h2>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink"
        >
          {showUploadForm ? 'Cancel' : 'Upload Video'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && session && (
        <div className="glass rounded-xl p-6 mb-8 neon-border-pink">
          <form onSubmit={handleUpload} className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Upload New Video</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Video Title"
                value={uploadData.title}
                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Video URL"
                value={uploadData.videoUrl}
                onChange={(e) => setUploadData({...uploadData, videoUrl: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Thumbnail URL"
                value={uploadData.thumbnail}
                onChange={(e) => setUploadData({...uploadData, thumbnail: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g., 12:34)"
                value={uploadData.duration}
                onChange={(e) => setUploadData({...uploadData, duration: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
                required
              />
              <select
                value={uploadData.category}
                onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
              >
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={uploadData.tags}
                onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
              />
            </div>
            <textarea
              placeholder="Video Description"
              value={uploadData.description}
              onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
              rows={3}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {submitting ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>
      )}

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
        {videos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-xl text-gray-400">No videos yet</p>
            <p className="text-sm text-gray-500">Be the first to upload a video!</p>
          </div>
        ) : (
          videos.map((video, index) => (
            <div 
              key={video._id} 
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
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                <p className="text-sm text-gray-400 mb-3 neon-glow-cyan">{video.username}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatViews(video.views)} views</span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleLike(video._id)}
                      className={`flex items-center space-x-1 transition-colors duration-200 ${
                        video.userLikes.includes(session?.user?.name || '') ? 'text-pink-400' : 'hover:text-pink-400'
                      }`}
                    >
                      <span className={`transition-transform duration-200 ${
                        video.userLikes.includes(session?.user?.name || '') ? 'animate-pulse' : ''
                      }`}>
                        {video.userLikes.includes(session?.user?.name || '') ? '❤️' : '🤍'}
                      </span>
                      <span className={`transition-colors duration-200 ${
                        video.userLikes.includes(session?.user?.name || '') ? 'text-pink-400' : 'text-gray-400'
                      }`}>
                        {video.likes.toLocaleString()}
                      </span>
                    </button>
                    <span>💬 {video.comments}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {formatTime(video.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button 
          onClick={fetchVideos}
          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-black font-semibold rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 neon-border-pink"
        >
          Load More Videos
        </button>
      </div>
    </div>
  );
}