# GenZPlug Socket.IO Server

This is the separate Socket.IO server for GenZPlug's real-time features.

## Features

- **Chat Rooms**: Real-time messaging in chat rooms
- **Social Feed**: Live social media feed updates
- **Gaming**: Real-time game events and actions
- **Health Check**: `/health` endpoint for monitoring

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `env.example`:
   ```bash
   cp env.example .env
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set the following environment variables:
   - `PORT`: Railway will set this automatically
   - `ALLOWED_ORIGINS`: Your production domains (comma-separated)

3. Deploy and get your Railway URL (e.g., `https://genzplug-socket.railway.app`)

### Environment Variables

- `PORT`: Server port (Railway sets this automatically)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## API Endpoints

- `GET /health`: Health check endpoint
- WebSocket connection for real-time features

## Socket.IO Events

### Chat Events
- `join-chat-room`: Join a chat room
- `send-message`: Send a message
- `chat-history`: Receive chat history
- `new-message`: Receive new messages

### Social Feed Events
- `join-social-feed`: Join social feed
- `new-post`: Create a new post
- `like-post`: Like a post
- `social-feed-history`: Receive feed history
- `new-post`: Receive new posts
- `post-updated`: Receive post updates

### Gaming Events
- `join-game-room`: Join a game room
- `game-action`: Send game action
- `game-event`: Receive game events
