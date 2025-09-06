# Content Security Policy (CSP) Fix Guide

## Issue Description
The Content Security Policy (CSP) prevents the evaluation of arbitrary strings as JavaScript, which Socket.IO uses for some of its functionality. This causes connection errors.

## Root Cause
Socket.IO uses `eval()` and similar functions internally, which are blocked by CSP for security reasons.

## Fixes Applied

### 1. Updated Socket.IO Client Configuration (`src/lib/socket-client.tsx`)
- ✅ Disabled `allowEIO3` to avoid Engine.IO v3 compatibility (which uses eval)
- ✅ Added CSP-compliant configuration options
- ✅ Disabled features that might use string evaluation

### 2. Updated Socket.IO Server Configuration (`socket-server/server.js`)
- ✅ Disabled `allowEIO3` on the server side
- ✅ Added CSP headers middleware
- ✅ Configured proper security headers

### 3. Added CSP Headers to Next.js (`next.config.ts`)
- ✅ Added comprehensive CSP policy
- ✅ Allowed necessary domains for Socket.IO connections
- ✅ Added security headers (X-Frame-Options, X-Content-Type-Options, etc.)

## CSP Policy Details

### Next.js CSP Policy:
```javascript
"default-src 'self'",
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://genzplug-socket.railway.app https://*.railway.app",
"connect-src 'self' https://genzplug-socket.railway.app https://*.railway.app wss://genzplug-socket.railway.app wss://*.railway.app",
"style-src 'self' 'unsafe-inline'",
"img-src 'self' data: https:",
"font-src 'self' data:",
"object-src 'none'",
"base-uri 'self'",
"form-action 'self'",
"frame-ancestors 'none'",
"upgrade-insecure-requests"
```

### Socket.IO Server CSP Policy:
```javascript
"default-src 'self'",
"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
"connect-src 'self' https://genzplug.com https://genzplug.vercel.app wss://genzplug-socket.railway.app",
"style-src 'self' 'unsafe-inline'",
"img-src 'self' data: https:",
"font-src 'self' data:",
"object-src 'none'",
"base-uri 'self'",
"form-action 'self'",
"frame-ancestors 'none'"
```

## Testing the Fix

### 1. Check Browser Console
After deployment, check browser console for:
- ✅ No CSP violation errors
- ✅ Socket.IO connection successful
- ✅ No eval() related errors

### 2. Test Socket.IO Connection
```javascript
// Run in browser console on genzplug.com
const socket = io('https://genzplug-socket.railway.app');
socket.on('connect', () => console.log('✅ Connected!'));
socket.on('connect_error', (err) => console.error('❌ Error:', err));
```

### 3. Check Network Tab
- ✅ WebSocket connection established
- ✅ No blocked requests due to CSP
- ✅ Socket.IO handshake successful

## Alternative Solutions (If Issues Persist)

### Option 1: Relax CSP for Socket.IO
If you still get CSP errors, you can temporarily relax the CSP:

```javascript
// In next.config.ts, update script-src to:
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://genzplug-socket.railway.app https://*.railway.app https://cdn.socket.io"
```

### Option 2: Use Socket.IO CDN
Instead of self-hosting Socket.IO, use the CDN version:

```html
<!-- Add to your HTML head -->
<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
```

Then update CSP to allow the CDN:
```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.socket.io"
```

### Option 3: Disable CSP Temporarily
For testing purposes only, you can temporarily disable CSP:

```javascript
// In next.config.ts, comment out the CSP header
// {
//   key: 'Content-Security-Policy',
//   value: '...'
// }
```

## Security Considerations

### What CSP Protects Against:
- ✅ XSS attacks
- ✅ Code injection
- ✅ Data exfiltration
- ✅ Clickjacking

### Trade-offs:
- ⚠️ Some Socket.IO features may be limited
- ⚠️ Development debugging might be more complex
- ⚠️ Third-party integrations may need CSP updates

## Expected Results

After applying these fixes:
- ✅ No CSP violation errors in console
- ✅ Socket.IO connects successfully
- ✅ Real-time features work (chat, social feed, gaming)
- ✅ Security headers properly configured
- ✅ No eval() related errors

## Monitoring

### Check CSP Compliance:
1. Open browser dev tools
2. Go to Console tab
3. Look for CSP violation reports
4. Check Network tab for blocked requests

### Common CSP Violations:
- `script-src` violations: Scripts from unauthorized sources
- `connect-src` violations: WebSocket/HTTP connections blocked
- `style-src` violations: Inline styles blocked

## Next Steps

1. **Deploy the fixes** (already committed and pushed)
2. **Test in production** after deployment
3. **Monitor browser console** for any remaining CSP errors
4. **Adjust CSP policy** if needed for specific features

The CSP fixes should resolve the Socket.IO connection issues while maintaining security.
