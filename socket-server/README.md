# GenZPlug Socket.IO Server

This is the separate Socket.IO server for GenZPlug's real-time features, designed to work with Railway deployment and Vercel-hosted Next.js applications.

## Features

- **Chat Rooms**: Real-time messaging in chat rooms
- **Social Feed**: Live social media feed updates
- **Gaming**: Real-time game events and actions
- **Health Check**: `/health` endpoint for monitoring
- **CORS Support**: Configured for both development and production
- **Error Handling**: Comprehensive logging and error management

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `env.example`:
   ```bash
   cp env.example .env
   ```

3. Update `.env` with your local settings:
   ```env
   PORT=3001
   ALLOWED_ORIGINS=http://localhost:3000,https://genzplug.com,https://genzplug.vercel.app
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Update your Next.js `.env.local`:
   ```env
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

## Production Deployment

### Railway Deployment (Recommended)

Railway is perfect for Socket.IO servers as it provides persistent connections and WebSocket support.

#### Step 1: Deploy to Railway

1. **Connect Repository**: 
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the `socket-server` directory as the root

2. **Configure Environment Variables**:
   ```env
   PORT=3001  # Railway sets this automatically
   ALLOWED_ORIGINS=https://genzplug.com,https://genzplug.vercel.app,https://your-domain.com
   ```

3. **Deploy**: Railway will automatically deploy and provide a URL like:
   ```
   https://genzplug-socket-production.up.railway.app
   ```

#### Step 2: Update Next.js Environment

Update your production environment variables in Vercel:

```env
NEXT_PUBLIC_SOCKET_URL=https://genzplug-socket-production.up.railway.app
```

### Alternative Deployment Options

#### Heroku Deployment

1. Create `Procfile`:
   ```
   web: node server.js
   ```

2. Deploy:
   ```bash
   git subtree push --prefix socket-server heroku main
   ```

#### DigitalOcean App Platform

1. Create `.do/app.yaml`:
   ```yaml
   name: genzplug-socket-server
   services:
   - name: socket-server
     source_dir: socket-server
     github:
       repo: your-username/genzplug
       branch: main
     run_command: node server.js
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: ALLOWED_ORIGINS
       value: https://genzplug.com,https://genzplug.vercel.app
   ```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3001` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | Yes | `http://localhost:3000` |
| `REDIS_URL` | Redis connection for scaling | No | In-memory storage |
| `DATABASE_URL` | Database for persistent storage | No | In-memory storage |

### Scaling Considerations

For production scaling, consider:

1. **Redis Adapter**: Use Redis for multi-instance Socket.IO scaling
2. **Database Storage**: Store chat messages and posts in MongoDB/PostgreSQL
3. **Load Balancing**: Use Railway's built-in load balancing
4. **Monitoring**: Implement health checks and logging

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
