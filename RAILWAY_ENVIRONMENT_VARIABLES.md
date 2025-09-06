# Railway Environment Variables Configuration

## Socket.IO Server Environment Variables

### Required Variables for Railway Deployment

```bash
# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=production

# CORS Configuration - Replace with your actual domains
ALLOWED_ORIGINS=https://genzplug.com,https://genzplug.vercel.app,https://your-domain.com

# Optional: Redis configuration for production scaling
# REDIS_URL=redis://localhost:6379

# Optional: Database connection for persistent storage
# DATABASE_URL=mongodb://localhost:27017/genzplug_db
```

## Next.js Application Environment Variables

### Required Variables for Vercel Deployment

```bash
# Next.js Environment Variables
NEXTAUTH_URL=https://genzplug.com
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Socket.IO Configuration - Replace with your Railway Socket.IO server URL
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
NEXT_PUBLIC_SOCKET_SERVER_URL=https://your-socket-server.railway.app

# MongoDB Configuration - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genzplug?retryWrites=true&w=majority

# Stripe Configuration - Replace with your actual Stripe keys
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
NEXT_PUBLIC_APP_URL=https://genzplug.com

# Development Configuration
NODE_ENV=production
```

## Railway Deployment Steps

### 1. Deploy Socket.IO Server to Railway

1. **Create a new Railway project** for your Socket.IO server
2. **Connect your GitHub repository**
3. **Set the root directory** to `socket-server`
4. **Add the following environment variables:**

```bash
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
ALLOWED_ORIGINS=https://genzplug.com,https://genzplug.vercel.app
```

### 2. Deploy Next.js App to Vercel

1. **Connect your GitHub repository** to Vercel
2. **Set the root directory** to the main project folder
3. **Add the following environment variables:**

```bash
NEXTAUTH_URL=https://genzplug.com
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
NEXT_PUBLIC_SOCKET_SERVER_URL=https://your-socket-server.railway.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genzplug?retryWrites=true&w=majority
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
NEXT_PUBLIC_APP_URL=https://genzplug.com
NODE_ENV=production
```

## Important Notes

### Railway Socket.IO Server
- **PORT**: Railway automatically sets this, but you can override it
- **HOST**: Must be `0.0.0.0` to listen on all interfaces
- **ALLOWED_ORIGINS**: Must include your Vercel domain and any other domains you want to allow

### Vercel Next.js App
- **NEXT_PUBLIC_SOCKET_URL**: Must point to your Railway Socket.IO server
- **NEXTAUTH_SECRET**: Generate a secure random string
- **MONGODB_URI**: Use MongoDB Atlas for production
- **STRIPE_KEYS**: Use live keys for production

### Security Considerations
- **Never commit secrets** to your repository
- **Use environment variables** for all sensitive data
- **Generate strong secrets** for production
- **Use HTTPS** for all production URLs
- **Restrict CORS origins** to your actual domains

## Testing Your Deployment

### 1. Test Socket.IO Server
```bash
curl https://your-socket-server.railway.app/health
```

### 2. Test Next.js App
```bash
curl https://genzplug.com/api/health
```

### 3. Test WebSocket Connection
Visit: `https://genzplug.com/health`

## Troubleshooting

### Common Issues
1. **CORS Errors**: Make sure `ALLOWED_ORIGINS` includes your Vercel domain
2. **Connection Failed**: Verify `NEXT_PUBLIC_SOCKET_URL` points to your Railway server
3. **Environment Variables**: Double-check all variables are set correctly
4. **HTTPS**: Ensure all URLs use HTTPS in production

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Test Socket.IO server health
curl https://your-socket-server.railway.app/health

# Test Next.js health endpoint
curl https://genzplug.com/api/health
```

## Production Checklist

- [ ] Socket.IO server deployed to Railway
- [ ] Next.js app deployed to Vercel
- [ ] All environment variables set
- [ ] CORS origins configured correctly
- [ ] HTTPS enabled for all services
- [ ] Health endpoints responding
- [ ] WebSocket connections working
- [ ] Database connections established
- [ ] Stripe integration configured
- [ ] Authentication working
- [ ] Error monitoring set up
