'use client';

import SocialFeed from '@/components/SocialFeed';

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Social Feed
          </h1>
          <p className="text-gray-400 text-lg">
            Share your thoughts and see what&apos;s happening in real-time
          </p>
        </div>

        {/* Social Feed Component */}
        <SocialFeed />
      </div>
    </div>
  );
}
