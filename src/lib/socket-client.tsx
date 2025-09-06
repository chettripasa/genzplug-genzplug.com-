'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io } from 'socket.io-client';

// Define interfaces locally
interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  roomId?: string;
}

interface SocialPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  userLikes: string[];
}

interface GameEvent {
  type: 'join' | 'leave' | 'move' | 'action';
  userId: string;
  username: string;
  data?: Record<string, unknown>;
  roomId: string;
}

interface SocketContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnectAttempts: number;
  chatMessages: ChatMessage[];
  socialFeed: SocialPost[];
  gameEvents: GameEvent[];
  joinChatRoom: (roomId: string) => void;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  joinSocialFeed: () => void;
  createPost: (post: Omit<SocialPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  likePost: (postId: string) => void;
  joinGameRoom: (roomId: string) => void;
  sendGameAction: (event: Omit<GameEvent, 'userId' | 'username'>) => void;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  // Connection manager function
  const createSocketConnection = () => {
    // Skip socket connection during build process or SSR
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      // Get Socket.IO server URL from environment variables
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      
      // Only create socket connection if we have a valid URL
      if (!socketServerUrl || socketServerUrl === '') {
        console.warn('⚠️ NEXT_PUBLIC_SOCKET_URL not defined, skipping socket connection');
        setConnectionStatus('error');
        return null;
      }
      
      console.log(`🔌 Connecting to Socket.IO server: ${socketServerUrl}`);
      setConnectionStatus('connecting');
      
      const socketInstance = io(socketServerUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5
      });

      // Connection events
      socketInstance.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log(`❌ Disconnected from Socket.IO server: ${reason}`);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
        setConnectionStatus('error');
        setReconnectAttempts(prev => prev + 1);
      });

      socketInstance.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
      });

      socketInstance.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}`);
        setConnectionStatus('connecting');
        setReconnectAttempts(attemptNumber);
      });

      socketInstance.on('reconnect_error', (error) => {
        console.error('❌ Reconnection error:', error);
        setConnectionStatus('error');
      });

      socketInstance.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed after maximum attempts');
        setConnectionStatus('error');
      });

      // Error handling
      socketInstance.on('error', (error) => {
        console.error('❌ Socket.IO error:', error);
        setConnectionStatus('error');
      });

      // Chat events
      socketInstance.on('chat-history', (messages: ChatMessage[]) => {
        console.log('📨 Received chat history:', messages.length, 'messages');
        setChatMessages(messages);
      });

      socketInstance.on('new-message', (message: ChatMessage) => {
        console.log('💬 New message received:', message.message);
        setChatMessages(prev => [...prev, message]);
      });

      // Social feed events
      socketInstance.on('social-feed-history', (posts: SocialPost[]) => {
        console.log('📱 Received social feed history:', posts.length, 'posts');
        setSocialFeed(posts);
      });

      socketInstance.on('new-post', (post: SocialPost) => {
        console.log('📝 New post received:', post.content);
        setSocialFeed(prev => [post, ...prev]);
      });

      socketInstance.on('post-updated', (updatedPost: SocialPost) => {
        console.log('👍 Post updated:', updatedPost.id);
        setSocialFeed(prev => 
          prev.map(post => post.id === updatedPost.id ? updatedPost : post)
        );
      });

      // Game events
      socketInstance.on('game-event', (event: GameEvent) => {
        console.log('🎮 Game event received:', event.type);
        setGameEvents(prev => [...prev, event]);
      });

      return socketInstance;
    } catch (error) {
      console.error('❌ Failed to initialize socket connection:', error);
      setConnectionStatus('error');
      return null;
    }
  };

  useEffect(() => {
    const socketInstance = createSocketConnection();
    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        console.log('🔌 Disconnecting socket...');
        socketInstance.disconnect();
      }
    };
  }, []);

  // Manual reconnect function
  const reconnect = () => {
    console.log('🔄 Manual reconnect requested');
    if (socket) {
      socket.disconnect();
    }
    const newSocket = createSocketConnection();
    setSocket(newSocket);
  };

  const joinChatRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join-chat-room', roomId);
    }
  };

  const sendMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (socket) {
      socket.emit('send-message', message);
    }
  };

  const joinSocialFeed = () => {
    if (socket) {
      socket.emit('join-social-feed');
    }
  };

  const createPost = (post: Omit<SocialPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    if (socket) {
      socket.emit('new-post', post);
    }
  };

  const likePost = (postId: string) => {
    if (socket) {
      socket.emit('like-post', postId);
    }
  };

  const joinGameRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join-game-room', roomId);
    }
  };

  const sendGameAction = (event: Omit<GameEvent, 'userId' | 'username'>) => {
    if (socket) {
      socket.emit('game-action', event);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    connectionStatus,
    reconnectAttempts,
    chatMessages,
    socialFeed,
    gameEvents,
    joinChatRoom,
    sendMessage,
    joinSocialFeed,
    createPost,
    likePost,
    joinGameRoom,
    sendGameAction,
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
