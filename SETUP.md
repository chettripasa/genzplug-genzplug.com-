# GenZPlug Setup Guide

This guide will help you set up the GenZPlug application locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd genzplug
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Stripe Configuration (Optional for development)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App Configuration
APP_NAME=GenZPlug
APP_URL=http://localhost:3000
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Demo Login Credentials

For testing purposes, you can use these demo credentials:
- Email: `demo@genzplug.com`
- Password: `demo123`

## Features

- **Social Feed**: Real-time social interactions
- **Video Hub**: Video sharing and streaming
- **Gaming Hub**: Multiplayer gaming experiences
- **Shop**: E-commerce functionality with Stripe integration
- **Community**: Chat and community features

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe
- **Real-time**: Socket.io
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
├── models/              # MongoDB models
└── types/               # TypeScript type definitions
```

## Development Notes

- The application uses Next.js 15 with the app router
- Authentication is handled by NextAuth.js with JWT strategy
- Real-time features use Socket.io
- Payments are processed through Stripe
- The app is optimized for Vercel deployment

## Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure all required environment variables are set in `.env.local`
2. **MongoDB Connection**: Verify your MongoDB URI is correct
3. **NextAuth Secret**: Ensure you have a secure secret for NextAuth
4. **Port Conflicts**: Make sure port 3000 is available

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the MongoDB connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.