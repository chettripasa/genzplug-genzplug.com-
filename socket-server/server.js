const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Enhanced logging
console.log('🚀 Starting GenZPlug Socket.IO Server...');
console.log('📋 Environment:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
});

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://genzplug.com',
    'https://genzplug.vercel.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'socket-server',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      connections: io.engine.clientsCount || 0
    });
    console.log('✅ Health check requested');
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://genzplug.com',
      'https://genzplug.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  allowEIO3: true
});

// Enhanced Socket.IO logging
io.engine.on('connection_error', (err) => {
  console.error('❌ Socket.IO connection error:', err);
});

io.on('connect_error', (err) => {
  console.error('❌ Socket.IO connect error:', err);
});

// In-memory storage (in production, consider using Redis)
const chatRooms = new Map();
const socialFeed = [];
const gameRooms = new Map();

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Error handling for socket events
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  // Chat system events
  socket.on('join-chat-room', (roomId) => {
    try {
      if (!roomId || typeof roomId !== 'string') {
        socket.emit('error', { message: 'Invalid room ID' });
        return;
      }
      
      socket.join(`chat-${roomId}`);
      if (!chatRooms.has(roomId)) {
        chatRooms.set(roomId, []);
      }
      socket.emit('chat-history', chatRooms.get(roomId) || []);
      console.log(`User ${socket.id} joined chat room: ${roomId}`);
    } catch (error) {
      console.error(`Error joining chat room ${roomId}:`, error);
      socket.emit('error', { message: 'Failed to join chat room' });
    }
  });

  socket.on('send-message', (message) => {
    try {
      if (!message || !message.message || !message.userId || !message.username) {
        socket.emit('error', { message: 'Invalid message format' });
        return;
      }

      const chatMessage = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
      };

      const roomId = message.roomId || 'general';
      const roomMessages = chatRooms.get(roomId) || [];
      roomMessages.push(chatMessage);
      chatRooms.set(roomId, roomMessages);

      io.to(`chat-${roomId}`).emit('new-message', chatMessage);
      console.log(`Message sent in room ${roomId}: ${message.message}`);
    } catch (error) {
      console.error(`Error sending message:`, error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Social feed events
  socket.on('join-social-feed', () => {
    try {
      socket.join('social-feed');
      socket.emit('social-feed-history', socialFeed);
      console.log(`📱 User ${socket.id} joined social feed`);
    } catch (error) {
      console.error(`❌ Error joining social feed:`, error);
      socket.emit('error', { message: 'Failed to join social feed' });
    }
  });

  socket.on('new-post', (post) => {
    try {
      if (!post || !post.content || !post.userId || !post.username) {
        socket.emit('error', { message: 'Invalid post format' });
        return;
      }

      const socialPost = {
        ...post,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        userLikes: []
      };

      socialFeed.unshift(socialPost);
      // Keep only last 100 posts
      if (socialFeed.length > 100) {
        socialFeed.splice(100);
      }

      io.to('social-feed').emit('new-post', socialPost);
      console.log(`📝 New post created by ${post.username}`);
    } catch (error) {
      console.error(`❌ Error creating post:`, error);
      socket.emit('error', { message: 'Failed to create post' });
    }
  });

  socket.on('like-post', (postId) => {
    try {
      if (!postId || typeof postId !== 'string') {
        socket.emit('error', { message: 'Invalid post ID' });
        return;
      }

      const post = socialFeed.find(p => p.id === postId);
      if (post) {
        post.likes++;
        io.to('social-feed').emit('post-updated', post);
        console.log(`👍 Post ${postId} liked`);
      } else {
        socket.emit('error', { message: 'Post not found' });
      }
    } catch (error) {
      console.error(`❌ Error liking post:`, error);
      socket.emit('error', { message: 'Failed to like post' });
    }
  });

  // Gaming events
  socket.on('join-game-room', (roomId) => {
    try {
      if (!roomId || typeof roomId !== 'string') {
        socket.emit('error', { message: 'Invalid game room ID' });
        return;
      }

      socket.join(`game-${roomId}`);
      if (!gameRooms.has(roomId)) {
        gameRooms.set(roomId, new Set());
      }
      gameRooms.get(roomId).add(socket.id);
      
      const gameEvent = {
        type: 'join',
        userId: socket.id,
        username: 'Anonymous', // Will be updated with actual user data
        roomId
      };
      
      io.to(`game-${roomId}`).emit('game-event', gameEvent);
      console.log(`🎮 User ${socket.id} joined game room: ${roomId}`);
    } catch (error) {
      console.error(`❌ Error joining game room:`, error);
      socket.emit('error', { message: 'Failed to join game room' });
    }
  });

  socket.on('game-action', (event) => {
    try {
      if (!event || !event.type || !event.roomId) {
        socket.emit('error', { message: 'Invalid game action format' });
        return;
      }

      const gameEvent = {
        ...event,
        userId: socket.id,
        username: 'Player' // This should be replaced with actual username from session
      };

      io.to(`game-${event.roomId}`).emit('game-event', gameEvent);
      console.log(`🎯 Game action in room ${event.roomId}: ${event.type}`);
    } catch (error) {
      console.error(`❌ Error processing game action:`, error);
      socket.emit('error', { message: 'Failed to process game action' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from game rooms
    gameRooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        const gameEvent = {
          type: 'leave',
          userId: socket.id,
          username: 'Anonymous',
          roomId
        };
        io.to(`game-${roomId}`).emit('game-event', gameEvent);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces for Railway

server.listen(PORT, HOST, () => {
  console.log('🎉 Socket.IO Server Started Successfully!');
  console.log(`🌐 Server running on ${HOST}:${PORT}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📡 Socket.IO endpoint: http://${HOST}:${PORT}/socket.io/`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Allowed origins: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
