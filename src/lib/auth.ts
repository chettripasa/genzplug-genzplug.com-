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
        console.log('🔐 Authorization attempt for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          // Add timeout to database connection
          const dbConnectPromise = dbConnect();
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Database connection timeout')), 15000);
          });
          
          await Promise.race([dbConnectPromise, timeoutPromise]);
          
          // Check for demo user first
          if (credentials.email === 'demo@genzplug.com' && credentials.password === 'demo123') {
            console.log('🎮 Demo user login attempt');
            // Create or find demo user
            let demoUser = await User.findOne({ email: 'demo@genzplug.com' });
            if (!demoUser) {
              console.log('📝 Creating new demo user');
              demoUser = new User({
                name: 'Demo User',
                email: 'demo@genzplug.com',
                password: await bcrypt.hash('demo123', 12),
              });
              await demoUser.save();
            }
            
            console.log('✅ Demo user authenticated successfully');
            return {
              id: demoUser._id.toString(),
              email: demoUser.email,
              name: demoUser.name,
              image: demoUser.image,
            };
          }

          // Check database for other users with timeout
          const findUserPromise = User.findOne({ email: credentials.email });
          const userTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('User lookup timeout')), 8000);
          });
          
          const user = await Promise.race([findUserPromise, userTimeoutPromise]);
          
          if (!user || !user.password) {
            console.log('❌ User not found or no password set');
            return null;
          }

          console.log('👤 User found, checking password');

          // Password comparison with timeout
          const comparePromise = bcrypt.compare(credentials.password, user.password);
          const compareTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Password comparison timeout')), 5000);
          });
          
          const isPasswordValid = await Promise.race([comparePromise, compareTimeoutPromise]);
          
          if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return null;
          }

          console.log('✅ User authenticated successfully');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          
          // For NextAuth credentials provider, we should return null for invalid credentials
          // instead of throwing errors, as throwing causes 401 responses
          if (error instanceof Error) {
            if (error.message.includes('timeout')) {
              console.error('Authentication timeout:', error.message);
              return null; // Return null for timeout to show generic error
            } else if (error.message.includes('Invalid credentials')) {
              console.error('Invalid credentials:', error.message);
              return null; // Return null for invalid credentials
            } else {
              console.error('Authentication failed:', error.message);
              return null; // Return null for other errors
            }
          }
          
          console.error('Unknown authentication error:', error);
          return null; // Return null for unknown errors
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
