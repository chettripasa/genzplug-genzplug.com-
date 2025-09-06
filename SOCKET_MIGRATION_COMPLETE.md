# GenZPlug Socket.IO Migration Guide

This guide documents the complete migration of Socket.IO from Next.js to a separate server compatible with Railway deployment.

## Migration Overview

The Socket.IO implementation has been successfully migrated from the Next.js application to a separate Express server. This change enables:

- ✅ **Vercel Compatibility**: No more Socket.IO server errors on Vercel
- ✅ **Railway Deployment**: Dedicated Socket.IO server on Railway
- ✅ **Scalability**: Independent scaling of Socket.IO server
- ✅ **Development**: Concurrent development with both servers

## Architecture Changes

### Before Migration
```
Next.js App (Vercel)
├── Socket.IO Server (❌ Not supported)
├── API Routes
└── Client Components
```

### After Migration
```
Next.js App (Vercel)          Socket.IO Server (Railway)
├── API Routes               ├── Express Server
├── Client Components        ├── Socket.IO Events
└── Socket Client            └── Real-time Features
```

## Files Changed

### Removed Files
- `src/lib/socket-server.ts` - Server-side Socket.IO code removed

### Modified Files
- `src/lib/socket-client.tsx` - Updated to use `NEXT_PUBLIC_SOCKET_URL`
- `package.json` - Removed server-side Socket.IO dependencies
- `socket-server/README.md` - Enhanced with deployment instructions

### New/Existing Files
- `socket-server/server.js` - Standalone Express + Socket.IO server
- `socket-server/package.json` - Socket server dependencies
- `socket-server/env.example` - Environment configuration template

## Environment Variables

### Next.js Application (.env.local)
```env
# Socket.IO Server URL for client connections
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Add your other environment variables here
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# MONGODB_URI=your_mongodb_connection_string
# NEXTAUTH_SECRET=your_nextauth_secret
# NEXTAUTH_URL=http://localhost:3000
# STRIPE_SECRET_KEY=your_stripe_secret_key
# STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Socket Server (socket-server/.env)
```env
# Server Configuration
PORT=3001

# CORS Configuration - Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,https://genzplug.com,https://genzplug.vercel.app

# Optional: Redis configuration for production scaling
# REDIS_URL=redis://localhost:6379

# Optional: Database connection for persistent storage
# DATABASE_URL=mongodb://localhost:27017/genzplug_db
```

## Development Workflow

### Local Development
1. **Start Socket Server**:
   ```bash
   cd socket-server
   npm install
   cp env.example .env
   npm run dev
   ```

2. **Start Next.js App**:
   ```bash
   npm install
   # Create .env.local with NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   npm run dev
   ```

3. **Or run both concurrently**:
   ```bash
   npm run dev:all
   ```

### Production Deployment

#### Step 1: Deploy Socket Server to Railway
1. Connect GitHub repository to Railway
2. Set root directory to `socket-server`
3. Configure environment variables:
   - `ALLOWED_ORIGINS`: Your production domains
4. Deploy and get Railway URL

#### Step 2: Update Next.js Environment
1. In Vercel dashboard, add environment variable:
   - `NEXT_PUBLIC_SOCKET_URL`: Your Railway Socket.IO server URL
2. Redeploy Next.js application

## Socket.IO Events

The following events are handled by the Socket.IO server:

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

## Testing the Migration

### Local Testing
1. Start both servers
2. Open browser console
3. Check for Socket.IO connection logs
4. Test real-time features (chat, social feed, gaming)

### Production Testing
1. Deploy Socket.IO server to Railway
2. Update Next.js environment variables
3. Deploy Next.js to Vercel
4. Test real-time features in production

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**:
   - Check `NEXT_PUBLIC_SOCKET_URL` environment variable
   - Verify Socket.IO server is running
   - Check CORS configuration

2. **CORS Errors**:
   - Update `ALLOWED_ORIGINS` in Socket.IO server
   - Ensure production domains are included

3. **Build Errors**:
   - Ensure Socket.IO server code is removed from Next.js
   - Check for any remaining server-side Socket.IO imports

### Health Checks
- Socket.IO server: `GET /health`
- Check browser console for connection status
- Monitor Railway logs for server issues

## Benefits Achieved

- ✅ **Vercel Compatibility**: No more Socket.IO server errors
- ✅ **Scalability**: Socket.IO server can scale independently
- ✅ **Development**: Cleaner separation of concerns
- ✅ **Deployment**: Flexible deployment options
- ✅ **Performance**: Optimized for each platform's strengths

## Next Steps

1. **Monitor Performance**: Track Socket.IO server performance
2. **Add Redis**: Implement Redis for multi-instance scaling
3. **Database Integration**: Store persistent data in MongoDB
4. **Monitoring**: Add comprehensive logging and monitoring
5. **Security**: Implement authentication for Socket.IO connections
