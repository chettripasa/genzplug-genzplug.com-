'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, SocialPost, GameEvent } from './socket-server';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
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
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    // Chat events
    socketInstance.on('chat-history', (messages: ChatMessage[]) => {
      setChatMessages(messages);
    });

    socketInstance.on('new-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    // Social feed events
    socketInstance.on('social-feed-history', (posts: SocialPost[]) => {
      setSocialFeed(posts);
    });

    socketInstance.on('new-post', (post: SocialPost) => {
      setSocialFeed(prev => [post, ...prev]);
    });

    socketInstance.on('post-updated', (updatedPost: SocialPost) => {
      setSocialFeed(prev => 
        prev.map(post => post.id === updatedPost.id ? updatedPost : post)
      );
    });

    // Game events
    socketInstance.on('game-event', (event: GameEvent) => {
      setGameEvents(prev => [...prev, event]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

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
