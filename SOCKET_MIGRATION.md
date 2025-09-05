# GenZPlug Socket.IO Migration Guide

## Overview

This migration separates the Socket.IO server from the Next.js application to work with Vercel's serverless architecture.

## Architecture

- **Next.js App**: Deployed on Vercel (serverless)
- **Socket.IO Server**: Deployed on Railway (persistent server)
- **Client**: Connects to external Socket.IO server

## Setup Instructions

### 1. Install Socket Server Dependencies

```bash
npm run install:socket
```

### 2. Local Development

#### Option A: Run Both Servers Separately
```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Socket.IO server
npm run dev:socket
```

#### Option B: Run Both Servers Together
```bash
npm run dev:all
```

### 3. Environment Variables

#### Local Development (.env.local)
```env
# Next.js App
MONGODB_URI=mongodb://localhost:27017/genzplug_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:3001

# Socket.IO Server (socket-server/.env)
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,https://genzplug.com
```

#### Production (Vercel)
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://genzplug.com
NEXTAUTH_SECRET=your-production-secret
NEXT_PUBLIC_APP_URL=https://genzplug.com
NEXT_PUBLIC_SOCKET_SERVER_URL=https://genzplug-socket.railway.app
```

#### Production (Railway)
```env
PORT=3001
ALLOWED_ORIGINS=https://genzplug.com,https://genzplug.vercel.app
```

## Deployment

### 1. Deploy Socket.IO Server to Railway

1. Create a new Railway project
2. Connect your GitHub repository
3. Set the root directory to `socket-server/`
4. Set environment variables:
   - `ALLOWED_ORIGINS`: Your production domains
5. Deploy and get your Railway URL

### 2. Update Vercel Environment Variables

Add `NEXT_PUBLIC_SOCKET_SERVER_URL` with your Railway URL to Vercel.

### 3. Deploy Next.js App to Vercel

The app will now work without Socket.IO server issues.

## Testing

1. **Local**: Both servers should run without errors
2. **Production**: Check browser console for Socket.IO connection
3. **Health Check**: Visit `https://your-railway-url.railway.app/health`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `ALLOWED_ORIGINS` environment variable
2. **Connection Failed**: Verify `NEXT_PUBLIC_SOCKET_SERVER_URL` is correct
3. **Build Errors**: Ensure Socket.IO server code is removed from Next.js

### Debug Commands

```bash
# Check Socket.IO server health
curl https://your-railway-url.railway.app/health

# Check environment variables
echo $NEXT_PUBLIC_SOCKET_SERVER_URL
```

## Migration Benefits

- ✅ **Vercel Compatibility**: No more Socket.IO server errors
- ✅ **Scalability**: Socket.IO server can scale independently
- ✅ **Reliability**: Persistent WebSocket connections
- ✅ **Development**: Easy local development setup
- ✅ **Production**: Separate deployment pipelines
