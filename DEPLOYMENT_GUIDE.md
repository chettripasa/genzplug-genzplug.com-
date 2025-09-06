# GenZPlug Socket.IO Migration & Deployment Guide

This comprehensive guide covers the complete migration of Socket.IO from Next.js to a separate server and deployment to Railway.

## 🎯 Migration Overview

The Socket.IO implementation has been successfully migrated from the Next.js application to a separate Express server, enabling:

- ✅ **Vercel Compatibility**: No more Socket.IO server errors on Vercel
- ✅ **Railway Deployment**: Dedicated Socket.IO server on Railway
- ✅ **Enhanced Error Handling**: Comprehensive error management and logging
- ✅ **Retry Logic**: Automatic reconnection with fallback to polling
- ✅ **Production Ready**: Optimized for both development and production

## 🏗️ Architecture Changes

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

## 🚀 Deployment Instructions

### Step 1: Deploy Socket.IO Server to Railway

#### Option A: Railway Dashboard (Recommended)

1. **Create Railway Account**:
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Connect Repository**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your GenZPlug repository

3. **Configure Deployment**:
   - Set **Root Directory** to `socket-server`
   - Railway will automatically detect the Node.js app

4. **Set Environment Variables**:
   ```env
   PORT=3001
   ALLOWED_ORIGINS=https://your-domain.com,https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the Railway URL (e.g., `https://genzplug-socket-production.up.railway.app`)

#### Option B: Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up --service socket-server
   ```

3. **Set Environment Variables**:
   ```bash
   railway variables set ALLOWED_ORIGINS="https://your-domain.com,https://your-app.vercel.app"
   railway variables set NODE_ENV="production"
   ```

### Step 2: Deploy Next.js App to Vercel

1. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables**:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.com
   MONGODB_URI=your-production-mongodb-uri
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. **Deploy**:
   - Vercel will automatically deploy on every push to main branch

## 🔧 Development Setup

### Local Development

1. **Install Dependencies**:
   ```bash
   # Install Next.js dependencies
   npm install
   
   # Install Socket.IO server dependencies
   cd socket-server
   npm install
   cd ..
   ```

2. **Set Up Environment Variables**:
   ```bash
   # Copy environment files
   cp .env.example .env.local
   cd socket-server
   cp env.example .env
   cd ..
   ```

3. **Start Development Servers**:
   ```bash
   # Start both servers concurrently
   npm run dev:all
   
   # Or start separately
   npm run dev          # Next.js app (port 3000)
   npm run dev:socket   # Socket.IO server (port 3001)
   ```

### Environment Variables

#### Next.js (.env.local)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXTAUTH_SECRET=your-development-secret
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/genzplug
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Socket.IO Server (socket-server/.env)
```env
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,https://genzplug.com,https://genzplug.vercel.app
```

## 🧪 Testing Procedures

### Development Testing

1. **Start Both Servers**:
   ```bash
   npm run dev:all
   ```

2. **Check Socket.IO Server**:
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test Client Connection**:
   - Open browser console
   - Look for Socket.IO connection logs
   - Test real-time features (chat, social feed, gaming)

### Production Testing

1. **Health Check**:
   ```bash
   curl https://your-socket-server.railway.app/health
   ```

2. **Browser Testing**:
   - Open production app
   - Check browser console for connection status
   - Test all real-time features

3. **Monitor Logs**:
   - Check Railway logs for Socket.IO server
   - Check Vercel logs for Next.js app

## 🔍 Troubleshooting

### Common Issues

#### Socket Connection Failed
**Symptoms**: Client can't connect to Socket.IO server
**Solutions**:
- Check `NEXT_PUBLIC_SOCKET_URL` environment variable
- Verify Socket.IO server is running
- Check CORS configuration in Socket.IO server
- Ensure Railway URL is correct

#### CORS Errors
**Symptoms**: Browser shows CORS errors
**Solutions**:
- Update `ALLOWED_ORIGINS` in Socket.IO server
- Include all production domains
- Check for typos in domain names

#### JSON Parse Errors
**Symptoms**: "An error o" or similar JSON errors
**Solutions**:
- Check API routes for proper error handling
- Ensure all responses return valid JSON
- Check request body format

#### Railway Deployment Issues
**Symptoms**: Socket.IO server won't start on Railway
**Solutions**:
- Verify `railway.json` configuration
- Check environment variables
- Ensure `package.json` has correct start script
- Check Railway logs for errors

### Debug Commands

```bash
# Check Socket.IO server health
curl https://your-socket-server.railway.app/health

# Test Socket.IO connection
curl -I https://your-socket-server.railway.app/socket.io/

# Check Railway logs
railway logs

# Check Vercel logs
vercel logs
```

## 📊 Monitoring & Maintenance

### Health Monitoring

1. **Socket.IO Server Health**:
   - Endpoint: `GET /health`
   - Returns: Server status, uptime, memory usage, connection count

2. **Client Connection Status**:
   - Check browser console logs
   - Monitor reconnection attempts
   - Track connection status changes

### Performance Optimization

1. **Socket.IO Server**:
   - Monitor memory usage
   - Consider Redis for scaling
   - Implement rate limiting
   - Add authentication

2. **Client Connection**:
   - Monitor reconnection attempts
   - Optimize event handling
   - Implement connection pooling

## 🔐 Security Considerations

### Production Security

1. **Environment Variables**:
   - Use strong, unique secrets
   - Rotate keys regularly
   - Never commit secrets to version control

2. **CORS Configuration**:
   - Only allow trusted origins
   - Use HTTPS in production
   - Validate all requests

3. **Socket.IO Security**:
   - Implement authentication
   - Add rate limiting
   - Validate all events
   - Use secure transports

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Redis Adapter**:
   ```javascript
   const { createAdapter } = require('@socket.io/redis-adapter');
   const { createClient } = require('redis');
   
   const pubClient = createClient({ url: process.env.REDIS_URL });
   const subClient = pubClient.duplicate();
   
   io.adapter(createAdapter(pubClient, subClient));
   ```

2. **Load Balancing**:
   - Use Railway's built-in load balancing
   - Implement sticky sessions
   - Monitor connection distribution

### Database Integration

1. **Persistent Storage**:
   ```javascript
   // Store messages in MongoDB
   const Message = require('./models/Message');
   
   socket.on('send-message', async (message) => {
     const savedMessage = await Message.create(message);
     io.to(`chat-${message.roomId}`).emit('new-message', savedMessage);
   });
   ```

## 🎉 Success Metrics

After successful deployment, you should see:

- ✅ Socket.IO server running on Railway
- ✅ Next.js app deployed on Vercel
- ✅ Real-time features working in production
- ✅ No CORS errors in browser console
- ✅ Health checks returning 200 status
- ✅ Automatic reconnection working
- ✅ Error handling functioning properly

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Railway and Vercel logs
3. Test locally first
4. Verify environment variables
5. Check browser console for errors

The migration is now complete and your Socket.IO implementation is ready for production! 🚀
