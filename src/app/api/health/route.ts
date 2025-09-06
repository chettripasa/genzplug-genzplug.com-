import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check Socket.IO server health
    let socketServerStatus = 'unknown';
    let socketServerLatency = 0;
    
    try {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                            process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 
                            'http://localhost:3001';
      
      const socketHealthStart = Date.now();
      const socketResponse = await fetch(`${socketServerUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      socketServerLatency = Date.now() - socketHealthStart;
      
      if (socketResponse.ok) {
        const socketData = await socketResponse.json();
        socketServerStatus = socketData.status || 'ok';
      } else {
        socketServerStatus = 'error';
      }
    } catch (socketError) {
      console.warn('Socket.IO server health check failed:', socketError);
      socketServerStatus = 'unreachable';
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      message: 'API is working correctly',
      responseTime: `${responseTime}ms`,
      services: {
        api: {
          status: 'ok',
          responseTime: `${responseTime}ms`
        },
        socketServer: {
          status: socketServerStatus,
          latency: `${socketServerLatency}ms`,
          url: process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001'
        }
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
}
