import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          // Add timeout to database connection
          const dbConnectPromise = dbConnect();
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database connection timeout')), 10000);
          });
          
          await Promise.race([dbConnectPromise, timeoutPromise]);
          
          // Check for demo user first
          if (credentials.email === 'demo@genzplug.com' && credentials.password === 'demo123') {
            // Create or find demo user
            let demoUser = await User.findOne({ email: 'demo@genzplug.com' });
            if (!demoUser) {
              demoUser = new User({
                name: 'Demo User',
                email: 'demo@genzplug.com',
                password: await bcrypt.hash('demo123', 12),
              });
              await demoUser.save();
            }
            
            return {
              id: demoUser._id.toString(),
              email: demoUser.email,
              name: demoUser.name,
              image: demoUser.image,
            };
          }

          // Check database for other users with timeout
          const findUserPromise = User.findOne({ email: credentials.email });
          const userTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('User lookup timeout')), 5000);
          });
          
          const user = await Promise.race([findUserPromise, userTimeoutPromise]);
          
          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          // Password comparison with timeout
          const comparePromise = bcrypt.compare(credentials.password, user.password);
          const compareTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Password comparison timeout')), 3000);
          });
          
          const isPasswordValid = await Promise.race([comparePromise, compareTimeoutPromise]);
          
          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          
          // Return specific error messages for different error types
          if (error instanceof Error) {
            if (error.message.includes('timeout')) {
              throw new Error('Authentication timeout. Please try again.');
            } else if (error.message.includes('Invalid credentials')) {
              throw new Error('Invalid email or password');
            } else {
              throw new Error('Authentication failed. Please try again.');
            }
          }
          
          throw new Error('Authentication failed. Please try again.');
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    // Remove the signUp line
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
};
