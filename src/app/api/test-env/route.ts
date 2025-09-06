import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    };
    
    // Check if MongoDB URI is valid format
    const mongoUriValid = process.env.MONGODB_URI && 
      (process.env.MONGODB_URI.startsWith('mongodb://') || 
       process.env.MONGODB_URI.startsWith('mongodb+srv://'));
    
    return NextResponse.json({
      status: 'success',
      message: 'Environment variables check',
      environment: envCheck,
      validation: {
        mongoUriValid: mongoUriValid,
        hasRequiredVars: !!(process.env.MONGODB_URI && process.env.NEXTAUTH_SECRET)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Environment check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Environment check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
