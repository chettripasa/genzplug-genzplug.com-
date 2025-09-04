'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SocialFeed from '@/components/dashboard/SocialFeed';
import VideoHub from '@/components/dashboard/VideoHub';
import GamingHub from '@/components/dashboard/GamingHub';
import Shop from '@/components/dashboard/Shop';
import CommunityHub from '@/components/dashboard/CommunityHub';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('social');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen gradient-bg-cyber flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-cyan-400 neon-glow-cyan">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  const tabs = [
    { id: 'social', name: 'Social Feed', icon: '📱', component: SocialFeed },
    { id: 'video', name: 'Video Hub', icon: '🎥', component: VideoHub },
    { id: 'gaming', name: 'Gaming Hub', icon: '🎮', component: GamingHub },
    { id: 'shop', name: 'Shop', icon: '🛍️', component: Shop },
    { id: 'community', name: 'Community', icon: '💬', component: CommunityHub }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SocialFeed;

  return (
    <div className="min-h-screen gradient-bg-cyber relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-float"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-40 w-2 h-2 bg-green-400 rounded-full animate-float"></div>
        <div className="absolute top-60 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-60 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg animate-rotate"></div>
              <h1 className="text-2xl font-bold neon-glow-cyan">GenZPlug Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Welcome, <span className="neon-glow-pink">{session.user?.name}</span>
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 neon-border-cyan"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 glass border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-400 to-pink-500 text-black neon-border-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              © 2024 GenZPlug. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                <span>Live</span>
              </span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
