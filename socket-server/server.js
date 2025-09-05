const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = createServer(app);

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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'socket-server'
  });
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
  transports: ['websocket', 'polling']
});

// In-memory storage (in production, consider using Redis)
const chatRooms = new Map();
const socialFeed = [];
const gameRooms = new Map();

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Chat system events
  socket.on('join-chat-room', (roomId) => {
    socket.join(`chat-${roomId}`);
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, []);
    }
    socket.emit('chat-history', chatRooms.get(roomId) || []);
    console.log(`User ${socket.id} joined chat room: ${roomId}`);
  });

  socket.on('send-message', (message) => {
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
  });

  // Social feed events
  socket.on('join-social-feed', () => {
    socket.join('social-feed');
    socket.emit('social-feed-history', socialFeed);
    console.log(`User ${socket.id} joined social feed`);
  });

  socket.on('new-post', (post) => {
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
    console.log(`New post created by ${post.username}`);
  });

  socket.on('like-post', (postId) => {
    const post = socialFeed.find(p => p.id === postId);
    if (post) {
      post.likes++;
      io.to('social-feed').emit('post-updated', post);
      console.log(`Post ${postId} liked`);
    }
  });

  // Gaming events
  socket.on('join-game-room', (roomId) => {
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
    console.log(`User ${socket.id} joined game room: ${roomId}`);
  });

  socket.on('game-action', (event) => {
    const gameEvent = {
      ...event,
      userId: socket.id,
      username: 'Player' // This should be replaced with actual username from session
    };

    io.to(`game-${event.roomId}`).emit('game-event', gameEvent);
    console.log(`Game action in room ${event.roomId}: ${event.type}`);
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

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
