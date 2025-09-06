#!/bin/bash

# GenZPlug Socket.IO Migration Quick Start Script
# This script helps set up the development environment quickly

echo "🚀 GenZPlug Socket.IO Migration Quick Start"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install main dependencies
echo "📦 Installing Next.js dependencies..."
npm install

# Install socket-server dependencies
echo "📦 Installing Socket.IO server dependencies..."
cd socket-server
npm install
cd ..

# Create environment files if they don't exist
echo "🔧 Setting up environment files..."

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << EOF
# Socket.IO Server URL for client connections
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/genzplug

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

if [ ! -f "socket-server/.env" ]; then
    echo "Creating socket-server/.env..."
    cat > socket-server/.env << EOF
# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://genzplug.com,https://genzplug.vercel.app
EOF
    echo "✅ Created socket-server/.env"
else
    echo "✅ socket-server/.env already exists"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in .env.local and socket-server/.env"
echo "2. Start development servers:"
echo "   npm run dev:all"
echo ""
echo "3. Or start separately:"
echo "   npm run dev          # Next.js app (port 3000)"
echo "   npm run dev:socket   # Socket.IO server (port 3001)"
echo ""
echo "4. Test the setup:"
echo "   curl http://localhost:3001/health"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT_GUIDE.md"
echo "🔧 For environment setup, see ENVIRONMENT_SETUP.md"
