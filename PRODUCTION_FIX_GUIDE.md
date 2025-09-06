# Production Fix Guide for GenZPlug

## Current Issues
Your production site at [genzplug.com](https://genzplug.com) is experiencing server errors because:

1. **Socket.IO Server Not Running**: The Railway Socket.IO server at `https://genzplug-socket.railway.app` is not accessible
2. **Missing Environment Variables**: Production environment needs proper configuration
3. **Placeholder Values**: Some environment variables still have placeholder values

## Immediate Fixes Needed

### 1. Deploy Socket.IO Server to Railway

**Step 1: Create Railway Project**
1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Set root directory to `socket-server`

**Step 2: Configure Environment Variables**
Add these environment variables in Railway:

```bash
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
ALLOWED_ORIGINS=https://genzplug.com,https://genzplug.vercel.app
```

**Step 3: Deploy**
- Railway will automatically deploy your Socket.IO server
- Note the generated URL (should be something like `https://genzplug-socket-production.railway.app`)

### 2. Update Vercel Environment Variables

**Step 1: Go to Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Go to your genzplug project
3. Navigate to Settings > Environment Variables

**Step 2: Update Socket.IO URL**
Replace the Socket.IO server URL with your actual Railway URL:

```bash
NEXT_PUBLIC_SOCKET_URL=https://your-actual-railway-url.railway.app
NEXT_PUBLIC_SOCKET_SERVER_URL=https://your-actual-railway-url.railway.app
```

**Step 3: Update Other Variables**
Make sure these are set correctly:

```bash
NEXTAUTH_SECRET=genzplug-production-secret-key-2024-secure-random-string
NODE_ENV=production
```

### 3. Redeploy Applications

**Step 1: Redeploy Vercel**
- Trigger a new deployment in Vercel (push to main branch or manually redeploy)

**Step 2: Verify Railway Deployment**
- Check Railway logs to ensure Socket.IO server is running
- Test the health endpoint: `https://your-railway-url.railway.app/health`

## Testing Your Fix

### 1. Test Socket.IO Server
```bash
curl https://your-railway-url.railway.app/health
```

### 2. Test Next.js App
```bash
curl https://genzplug.com/api/health
```

### 3. Test WebSocket Connection
Visit: `https://genzplug.com/health`

## Alternative: Quick Fix Without Railway

If you want to temporarily disable Socket.IO features:

1. **Update Socket Client** (`src/lib/socket-client.tsx`):
```typescript
// Add this check at the beginning of createSocketConnection()
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SOCKET_URL) {
  console.warn('Socket.IO disabled in production - no server URL configured');
  return null;
}
```

2. **Update Environment Variables**:
```bash
NEXT_PUBLIC_SOCKET_URL=
NEXT_PUBLIC_SOCKET_SERVER_URL=
```

## Expected Results

After fixing these issues:
- ✅ No more server errors on genzplug.com
- ✅ Socket.IO connection works in production
- ✅ Real-time features (chat, social feed, gaming) work
- ✅ Registration and authentication work properly

## Next Steps

1. **Deploy Socket.IO server to Railway** (recommended)
2. **Update Vercel environment variables**
3. **Redeploy both applications**
4. **Test all functionality**

The server errors should be resolved once the Socket.IO server is properly deployed and accessible.
