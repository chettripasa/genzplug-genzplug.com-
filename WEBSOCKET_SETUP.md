# WebSocket (Socket.IO) Integration

This document describes the WebSocket integration implemented in GenZPlug for real-time features.

## Features Implemented

### 1. Live Chat System
- **Location**: `/community` page
- **Features**:
  - Real-time messaging across multiple chat rooms
  - User authentication integration
  - Message history persistence
  - Typing indicators (prepared)
  - Room-based chat isolation

### 2. Real-time Social Feed
- **Location**: `/social` page
- **Features**:
  - Instant post creation and display
  - Real-time like updates
  - Live post feed updates
  - User authentication required for posting

### 3. Multiplayer Gaming Support
- **Location**: `/community` page (Games tab)
- **Features**:
  - Game room management
  - Player join/leave events
  - Real-time game actions
  - Support for multiple game types (puzzle, racing, strategy)

## Architecture

### Server-Side (`src/lib/socket-server.ts`)
- Socket.IO server setup with CORS configuration
- Event handlers for chat, social feed, and gaming
- In-memory storage for messages and game state
- Room-based message isolation

### Client-Side (`src/lib/socket-client.ts`)
- React context for Socket.IO client
- Custom hooks for easy component integration
- Automatic reconnection handling
- Event listeners for real-time updates

### Components
- `LiveChat.tsx`: Real-time chat interface
- `SocialFeed.tsx`: Real-time social feed
- `GameRoom.tsx`: Multiplayer gaming interface

## Setup Instructions

### 1. Install Dependencies
```bash
npm install socket.io socket.io-client @types/socket.io
```

### 2. Custom Server
The application now uses a custom server (`server.js`) to integrate Socket.IO with Next.js.

### 3. Environment Variables
Add to your `.env.local`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running the Application
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Usage Examples

### Using the Live Chat
```tsx
import LiveChat from '@/components/LiveChat';

function MyComponent() {
  return <LiveChat roomId="general" />;
}
```

### Using the Social Feed
```tsx
import SocialFeed from '@/components/SocialFeed';

function MyComponent() {
  return <SocialFeed />;
}
```

### Using the Game Room
```tsx
import GameRoom from '@/components/GameRoom';

function MyComponent() {
  return <GameRoom roomId="puzzle-room-1" gameType="puzzle" />;
}
```

## Socket Events

### Chat Events
- `join-chat-room`: Join a specific chat room
- `send-message`: Send a message to the current room
- `chat-history`: Receive message history
- `new-message`: Receive new messages

### Social Feed Events
- `join-social-feed`: Join the social feed
- `new-post`: Create a new post
- `like-post`: Like a post
- `social-feed-history`: Receive post history
- `new-post`: Receive new posts
- `post-updated`: Receive post updates

### Gaming Events
- `join-game-room`: Join a game room
- `game-action`: Send game actions
- `game-event`: Receive game events

## Future Enhancements

### Planned Features
1. **Database Integration**: Store messages and posts in MongoDB
2. **User Presence**: Show online/offline status
3. **Typing Indicators**: Show when users are typing
4. **File Sharing**: Support for image and file uploads
5. **Voice Chat**: WebRTC integration for voice communication
6. **Advanced Gaming**: Full game state management and synchronization

### Scalability Considerations
1. **Redis Integration**: For horizontal scaling
2. **Load Balancing**: Multiple Socket.IO servers
3. **Message Queuing**: For high-traffic scenarios
4. **Rate Limiting**: Prevent spam and abuse

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if the custom server is running
   - Verify environment variables
   - Check CORS configuration

2. **Messages Not Appearing**
   - Ensure user is authenticated
   - Check if user joined the correct room
   - Verify Socket.IO connection status

3. **Performance Issues**
   - Monitor memory usage
   - Consider implementing message pagination
   - Optimize event handlers

### Debug Mode
Enable debug logging by setting:
```javascript
// In socket-client.ts
const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
  transports: ['websocket', 'polling'],
  debug: true // Add this line
});
```

## Security Considerations

1. **Authentication**: All features require user authentication
2. **Input Validation**: Messages and posts are validated
3. **Rate Limiting**: Implement rate limiting for production
4. **CORS**: Proper CORS configuration for security
5. **Message Sanitization**: Sanitize user input to prevent XSS

## Performance Optimization

1. **Message Batching**: Batch multiple messages when possible
2. **Connection Pooling**: Reuse connections efficiently
3. **Memory Management**: Clean up disconnected users
4. **Event Debouncing**: Prevent excessive event emissions
