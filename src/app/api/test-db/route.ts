import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Test database connection
    await dbConnect();
    const connectionTime = Date.now() - startTime;
    
    // Test a simple query
    const queryStartTime = Date.now();
    const userCount = await User.countDocuments();
    const queryTime = Date.now() - queryStartTime;
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection test successful',
      timing: {
        connectionTime: `${connectionTime}ms`,
        queryTime: `${queryTime}ms`,
        totalTime: `${Date.now() - startTime}ms`
      },
      stats: {
        userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
