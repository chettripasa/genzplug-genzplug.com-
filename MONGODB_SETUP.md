# MongoDB Setup Guide

## The Issue
You're getting an "Internal server error during registration" because the `MONGODB_URI` environment variable is not properly configured.

## Quick Fix Options

### Option 1: MongoDB Atlas (Recommended - Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Create a database user
5. Get your connection string
6. Update your `.env.local` file:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genzplug?retryWrites=true&w=majority
```

### Option 2: Local MongoDB Installation
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use the local connection string in `.env.local`:

```bash
MONGODB_URI=mongodb://localhost:27017/genzplug
```

### Option 3: Docker MongoDB (Alternative)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Current Environment File
Your `.env.local` file should contain:

```bash
MONGODB_URI=mongodb://localhost:27017/genzplug
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

## Testing the Fix
1. Make sure your MongoDB is running
2. Start the development server: `npm run dev`
3. Try registering a new user
4. Check the console logs for any database connection errors

## Troubleshooting
- **Connection timeout**: Check if MongoDB is running
- **Authentication failed**: Verify username/password in connection string
- **Network error**: Check firewall settings and MongoDB Atlas IP whitelist
- **Database not found**: The database will be created automatically when you register a user

## Next Steps
Once MongoDB is connected, the registration should work properly. The error was occurring because the database connection was failing during the registration process.
