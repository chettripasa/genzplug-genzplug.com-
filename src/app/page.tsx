'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Client-only clock component to prevent hydration errors
function Clock() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime(); // Set initial time
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="text-sm text-gray-400">{currentTime}</div>;
}

// Demo data for trending posts
const trendingPosts = [
  {
    id: 1,
    title: "The Future of Gaming is Here",
    author: "CyberGamer",
    likes: 1247,
    comments: 89,
    time: "2m ago",
    category: "Gaming"
  },
  {
    id: 2,
    title: "AI Revolution in Social Media",
    author: "TechVision",
    likes: 892,
    comments: 156,
    time: "5m ago",
    category: "Technology"
  },
  {
    id: 3,
    title: "Virtual Reality Shopping Experience",
    author: "VRExplorer",
    likes: 567,
    comments: 43,
    time: "8m ago",
    category: "Innovation"
  },
  {
    id: 4,
    title: "Blockchain Gaming: The Next Big Thing",
    author: "CryptoGamer",
    likes: 2341,
    comments: 234,
    time: "12m ago",
    category: "Blockchain"
  }
];

// Demo data for live chat messages
const chatMessages = [
  { id: 1, user: "NeonRider", message: "Just discovered this amazing platform!", time: "now" },
  { id: 2, user: "CyberQueen", message: "The UI is absolutely stunning! 🔥", time: "now" },
  { id: 3, user: "TechWizard", message: "Can't wait to see what's next!", time: "now" },
  { id: 4, user: "FutureGamer", message: "This is the future of social gaming!", time: "now" },
  { id: 5, user: "DigitalNomad", message: "The neon effects are incredible!", time: "now" }
];

// Demo data for game previews
const gamePreviews = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    players: 1247,
    status: "Live",
    thumbnail: "🎮"
  },
  {
    id: 2,
    title: "Virtual Reality Arena",
    players: 892,
    status: "Live",
    thumbnail: "🥽"
  },
  {
    id: 3,
    title: "Neon Racing League",
    players: 567,
    status: "Live",
    thumbnail: "🏎️"
  }
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);

  const typingTexts = [
    "Welcome to the future of social gaming...",
    "Experience real-time connections...",
    "Join the neon revolution...",
    "Where technology meets community..."
  ];

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    const typingTimer = setInterval(() => {
      setCurrentTypingIndex((prev) => (prev + 1) % typingTexts.length);
    }, 4000);

    return () => clearInterval(typingTimer);
  }, [typingTexts.length]);

  useEffect(() => {
    const chatTimer = setInterval(() => {
      setActiveChatIndex((prev) => (prev + 1) % chatMessages.length);
    }, 3000);

    return () => clearInterval(chatTimer);
  }, [chatMessages.length]);

  useEffect(() => {
    let currentChar = 0;
    const text = typingTexts[currentTypingIndex];
    
    const typeTimer = setInterval(() => {
      if (currentChar <= text.length) {
        setTypingText(text.slice(0, currentChar));
        currentChar++;
      } else {
        clearInterval(typeTimer);
      }
    }, 100);

    return () => clearInterval(typeTimer);
  }, [currentTypingIndex, typingTexts]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen gradient-bg-cyber flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-cyan-400 neon-glow-cyan">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect to dashboard)
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg-cyber relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-float"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-40 w-2 h-2 bg-green-400 rounded-full animate-float"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg animate-rotate"></div>
              <h1 className="text-2xl font-bold neon-glow-cyan">GenZPlug</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Clock />
              <Link
                href="/auth/signin"
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 neon-border-cyan"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up">
              <span className="neon-glow-cyan">Welcome</span>
              <span className="text-white mx-4">to</span>
              <span className="neon-glow-pink">The Future</span>
            </h1>
            <div className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up">
              <span className="neon-glow-green animate-typewriter">{typingText}</span>
              <span className="animate-pulse-slow">|</span>
            </div>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 animate-fade-in-up">
              Experience the next generation of social gaming, real-time connections, and immersive digital experiences. 
              Join thousands of users in the most advanced platform ever created.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold text-lg rounded-lg hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 neon-border-cyan animate-glow"
            >
              Sign in to unlock full access
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 neon-glow-purple animate-glow">
            Live Platform Demo
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trending Posts */}
            <div className="glass rounded-xl p-6 neon-border-cyan">
              <h3 className="text-xl font-bold mb-4 neon-glow-cyan">🔥 Trending Posts</h3>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <div key={post.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {post.category.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{post.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>@{post.author}</span>
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="glass rounded-xl p-6 neon-border-pink">
              <h3 className="text-xl font-bold mb-4 neon-glow-pink">💬 Live Chat</h3>
              <div className="space-y-3 h-64 overflow-y-auto">
                {chatMessages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`animate-slide-in ${index === activeChatIndex ? 'neon-glow-green' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {message.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{message.user}</span>
                          <span className="text-xs text-gray-400">{message.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                <span className="text-sm text-green-400">Live</span>
              </div>
            </div>

            {/* Game Previews */}
            <div className="glass rounded-xl p-6 neon-border-green">
              <h3 className="text-xl font-bold mb-4 neon-glow-green">🎮 Live Games</h3>
              <div className="space-y-4">
                {gamePreviews.map((game, index) => (
                  <div key={game.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center space-x-3 p-3 bg-black bg-opacity-30 rounded-lg">
                      <div className="text-2xl">{game.thumbnail}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{game.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>👥 {game.players} players</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                            <span className="text-green-400">{game.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 neon-glow-blue animate-glow">
            Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🚀",
                title: "Real-time Gaming",
                description: "Experience seamless multiplayer gaming with zero latency"
              },
              {
                icon: "💬",
                title: "Live Chat",
                description: "Connect with players worldwide in real-time conversations"
              },
              {
                icon: "🎯",
                title: "AI Matchmaking",
                description: "Advanced AI algorithms for perfect player matching"
              },
              {
                icon: "🔒",
                title: "Secure Platform",
                description: "Enterprise-grade security for your gaming experience"
              }
            ].map((feature, index) => (
              <div key={index} className="glass rounded-xl p-6 text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 neon-glow-cyan">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-12 neon-border-cyan">
            <h2 className="text-5xl font-bold mb-6 neon-glow-pink animate-glow">
              Ready to Join the Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Sign in now to unlock unlimited access to the most advanced gaming platform ever created.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold text-xl rounded-lg hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 neon-border-cyan animate-glow"
            >
              Sign in to unlock full access
              <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 GenZPlug. The future of social gaming is here.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
