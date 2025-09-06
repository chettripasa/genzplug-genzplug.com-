# Socket.IO Production Troubleshooting Guide

## Current Issue
Socket.IO is not connecting on the main domain (genzplug.com) even though both servers are running.

## Root Cause Analysis

### ✅ What's Working:
- Railway Socket.IO server is running: `https://genzplug-socket.railway.app/health` ✅
- Vercel Next.js app is running: `https://genzplug.com/api/health` ✅
- Both servers respond to health checks

### ❌ What's Broken:
- CORS configuration blocking connections from genzplug.com
- Socket.IO endpoint not accessible
- Environment variables may not be properly set

## Fixes Applied

### 1. Enhanced CORS Configuration
Updated `socket-server/server.js` with:
- Dynamic CORS origin checking
- Proper headers configuration
- Better error logging for blocked origins

### 2. Railway Configuration
Created `socket-server/railway.json` for proper deployment settings.

## Next Steps to Fix Production

### Step 1: Update Railway Environment Variables
In your Railway dashboard, ensure these environment variables are set:

```bash
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
ALLOWED_ORIGINS=https://genzplug.com,https://genzplug.vercel.app,http://localhost:3000
```

### Step 2: Redeploy Railway Socket.IO Server
1. Go to Railway dashboard
2. Trigger a new deployment (push to main branch or manual redeploy)
3. Check logs for CORS errors

### Step 3: Verify Vercel Environment Variables
In Vercel dashboard, ensure these are set:

```bash
NEXT_PUBLIC_SOCKET_URL=https://genzplug-socket.railway.app
NEXT_PUBLIC_SOCKET_SERVER_URL=https://genzplug-socket.railway.app
NEXTAUTH_URL=https://genzplug.com
NEXTAUTH_SECRET=genzplug-production-secret-key-2024-secure-random-string
NODE_ENV=production
```

### Step 4: Test the Connection

#### Test Railway Socket.IO Server:
```bash
curl https://genzplug-socket.railway.app/health
```

#### Test Socket.IO Endpoint:
```bash
curl https://genzplug-socket.railway.app/socket.io/
```

#### Test from Browser:
1. Open browser dev tools
2. Go to https://genzplug.com
3. Check console for Socket.IO connection messages
4. Look for CORS errors

## Debugging Commands

### Check Railway Logs:
```bash
railway logs
```

### Test CORS from Browser:
```javascript
// Run this in browser console on genzplug.com
fetch('https://genzplug-socket.railway.app/health', {
  method: 'GET',
  headers: {
    'Origin': 'https://genzplug.com'
  }
}).then(r => r.text()).then(console.log).catch(console.error);
```

### Test Socket.IO Connection:
```javascript
// Run this in browser console on genzplug.com
const socket = io('https://genzplug-socket.railway.app');
socket.on('connect', () => console.log('✅ Connected!'));
socket.on('connect_error', (err) => console.error('❌ Connection error:', err));
```

## Expected Results After Fix

- ✅ No CORS errors in browser console
- ✅ Socket.IO connection successful
- ✅ Real-time features working (chat, social feed, gaming)
- ✅ Console shows: "✅ Connected to Socket.IO server"

## Alternative Solution (If Railway Issues Persist)

If Railway continues to have issues, you can temporarily disable Socket.IO in production:

### Update Socket Client:
```typescript
// In src/lib/socket-client.tsx, add this check:
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SOCKET_URL?.includes('railway.app')) {
  console.warn('Socket.IO disabled - Railway server not accessible');
  return null;
}
```

This will prevent Socket.IO connection errors while you troubleshoot the Railway deployment.

## Contact Information

If you continue to have issues:
1. Check Railway logs for specific error messages
2. Verify all environment variables are set correctly
3. Test the Socket.IO server independently
4. Consider using a different hosting service for Socket.IO if Railway continues to have issues
