import { Server as HTTPServer } from 'http';

// Conditional import to avoid build issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SocketIOServer: any = null;
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const socketIO = require('socket.io');
    SocketIOServer = socketIO.Server;
  } catch (error) {
    console.warn('Socket.IO server not available:', error);
  }
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  roomId?: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

export interface GameEvent {
  type: 'join' | 'leave' | 'move' | 'action';
  userId: string;
  username: string;
  data?: Record<string, unknown>;
  roomId: string;
}

class SocketServer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private io: any = null;
  private chatRooms: Map<string, ChatMessage[]> = new Map();
  private socialFeed: SocialPost[] = [];
  private gameRooms: Map<string, Set<string>> = new Map();

  initialize(httpServer: HTTPServer) {
    if (!SocketIOServer) {
      console.warn('SocketIOServer not available, skipping initialization');
      return;
    }
    
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
    console.log('Socket.IO server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log(`User connected: ${socket.id}`);

      // Chat system events
      socket.on('join-chat-room', (roomId: string) => {
        socket.join(`chat-${roomId}`);
        if (!this.chatRooms.has(roomId)) {
          this.chatRooms.set(roomId, []);
        }
        socket.emit('chat-history', this.chatRooms.get(roomId) || []);
      });

      socket.on('send-message', (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const chatMessage: ChatMessage = {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date()
        };

        const roomId = message.roomId || 'general';
        const roomMessages = this.chatRooms.get(roomId) || [];
        roomMessages.push(chatMessage);
        this.chatRooms.set(roomId, roomMessages);

        this.io!.to(`chat-${roomId}`).emit('new-message', chatMessage);
      });

      // Social feed events
      socket.on('join-social-feed', () => {
        socket.join('social-feed');
        socket.emit('social-feed-history', this.socialFeed);
      });

      socket.on('new-post', (post: Omit<SocialPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
        const socialPost: SocialPost = {
          ...post,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          likes: 0,
          comments: 0
        };

        this.socialFeed.unshift(socialPost);
        // Keep only last 100 posts
        if (this.socialFeed.length > 100) {
          this.socialFeed = this.socialFeed.slice(0, 100);
        }

        this.io!.to('social-feed').emit('new-post', socialPost);
      });

      socket.on('like-post', (postId: string) => {
        const post = this.socialFeed.find(p => p.id === postId);
        if (post) {
          post.likes++;
          this.io!.to('social-feed').emit('post-updated', post);
        }
      });

      // Gaming events
      socket.on('join-game-room', (roomId: string) => {
        socket.join(`game-${roomId}`);
        if (!this.gameRooms.has(roomId)) {
          this.gameRooms.set(roomId, new Set());
        }
        this.gameRooms.get(roomId)!.add(socket.id);
        
        const gameEvent: GameEvent = {
          type: 'join',
          userId: socket.id,
          username: 'Anonymous', // Will be updated with actual user data
          roomId
        };
        
        this.io!.to(`game-${roomId}`).emit('game-event', gameEvent);
      });

      socket.on('game-action', (event: Omit<GameEvent, 'userId' | 'username'>) => {
        const gameEvent: GameEvent = {
          ...event,
          userId: socket.id,
          username: 'Player' // This should be replaced with actual username from session
        };

        this.io!.to(`game-${event.roomId}`).emit('game-event', gameEvent);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Remove from game rooms
        this.gameRooms.forEach((users, roomId) => {
          if (users.has(socket.id)) {
            users.delete(socket.id);
            const gameEvent: GameEvent = {
              type: 'leave',
              userId: socket.id,
              username: 'Anonymous',
              roomId
            };
            this.io!.to(`game-${roomId}`).emit('game-event', gameEvent);
          }
        });
      });
    });
  }

  getIO() {
    return this.io;
  }
}

export const socketServer = new SocketServer();
