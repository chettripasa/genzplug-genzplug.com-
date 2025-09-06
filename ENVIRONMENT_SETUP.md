# Environment Configuration Guide

This guide explains how to set up environment variables for both the Next.js application and the Socket.IO server.

## Next.js Application (.env.local)

Create a `.env.local` file in the root directory with the following variables:

```env
# Socket.IO Server URL for client connections
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/genzplug

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Socket.IO Server (socket-server/.env)

Create a `.env` file in the `socket-server` directory:

```env
# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# CORS Configuration - Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,https://genzplug.com,https://genzplug.vercel.app

# Optional: Redis configuration for production scaling
# REDIS_URL=redis://localhost:6379

# Optional: Database connection for persistent storage
# DATABASE_URL=mongodb://localhost:27017/genzplug_db
```

## Production Environment Variables

### Vercel (Next.js App)

Set these environment variables in your Vercel dashboard:

```env
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.com
MONGODB_URI=your-production-mongodb-uri
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Railway (Socket.IO Server)

Set these environment variables in your Railway dashboard:

```env
PORT=3001
ALLOWED_ORIGINS=https://your-domain.com,https://your-app.vercel.app
NODE_ENV=production
```

## Environment Variable Descriptions

### Next.js Application Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL for client connections | Yes | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes | `your-secret-key-here` |
| `NEXTAUTH_URL` | Base URL for NextAuth.js | Yes | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/genzplug` |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | No | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No | `pk_test_...` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes | `http://localhost:3000` |

### Socket.IO Server Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3001` |
| `HOST` | Server host | No | `0.0.0.0` |
| `NODE_ENV` | Environment mode | No | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | Yes | `http://localhost:3000` |
| `REDIS_URL` | Redis connection for scaling | No | In-memory storage |
| `DATABASE_URL` | Database for persistent storage | No | In-memory storage |

## Setup Instructions

### Development Setup

1. **Copy environment files**:
   ```bash
   # For Next.js app
   cp .env.example .env.local
   
   # For Socket.IO server
   cd socket-server
   cp env.example .env
   ```

2. **Update variables**: Edit the copied files with your actual values

3. **Start both servers**:
   ```bash
   # Start both concurrently
   npm run dev:all
   
   # Or start separately
   npm run dev          # Next.js app
   npm run dev:socket   # Socket.IO server
   ```

### Production Setup

1. **Deploy Socket.IO server to Railway**:
   - Connect GitHub repository
   - Set root directory to `socket-server`
   - Configure environment variables
   - Deploy and get Railway URL

2. **Update Next.js environment**:
   - Add `NEXT_PUBLIC_SOCKET_URL` with Railway URL
   - Configure other production variables
   - Deploy to Vercel

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Regularly rotate API keys and secrets
- Use HTTPS in production
- Validate all environment variables on startup

## Troubleshooting

### Common Issues

1. **Socket connection failed**:
   - Check `NEXT_PUBLIC_SOCKET_URL` is correct
   - Verify Socket.IO server is running
   - Check CORS configuration

2. **CORS errors**:
   - Update `ALLOWED_ORIGINS` in Socket.IO server
   - Ensure production domains are included

3. **Environment variables not loading**:
   - Check file names (`.env.local` for Next.js, `.env` for Socket.IO)
   - Restart servers after changes
   - Verify variable names are correct
