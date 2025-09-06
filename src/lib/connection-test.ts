/**
 * Connection Testing Utilities
 * Provides functions to test WebSocket and API connectivity
 */

export interface ConnectionTestResult {
  success: boolean;
  latency: number;
  error?: string;
  details?: any;
}

export interface SocketConnectionTestResult extends ConnectionTestResult {
  transport?: string;
  socketId?: string;
}

/**
 * Test Socket.IO server connectivity
 */
export async function testSocketConnection(socketUrl?: string): Promise<SocketConnectionTestResult> {
  const startTime = Date.now();
  
  try {
    const url = socketUrl || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    // Test health endpoint first
    const healthResponse = await fetch(`${url}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status} ${healthResponse.statusText}`);
    }
    
    const healthData = await healthResponse.json();
    const latency = Date.now() - startTime;
    
    return {
      success: true,
      latency,
      details: healthData,
      transport: 'http'
    };
  } catch (error) {
    return {
      success: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      transport: 'http'
    };
  }
}

/**
 * Test Socket.IO WebSocket connection
 */
export function testSocketWebSocketConnection(socketUrl?: string): Promise<SocketConnectionTestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    try {
      const url = socketUrl || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      
      // Import Socket.IO client dynamically
      import('socket.io-client').then(({ io }) => {
        const socket = io(url, {
          transports: ['websocket'],
          timeout: 5000,
          forceNew: true,
          autoConnect: true
        });
        
        const timeout = setTimeout(() => {
          socket.disconnect();
          resolve({
            success: false,
            latency: Date.now() - startTime,
            error: 'Connection timeout',
            transport: 'websocket'
          });
        }, 5000);
        
        socket.on('connect', () => {
          clearTimeout(timeout);
          const latency = Date.now() - startTime;
          socket.disconnect();
          
          resolve({
            success: true,
            latency,
            socketId: socket.id,
            transport: 'websocket'
          });
        });
        
        socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          socket.disconnect();
          
          resolve({
            success: false,
            latency: Date.now() - startTime,
            error: error.message || 'Connection error',
            transport: 'websocket'
          });
        });
        
      }).catch((importError) => {
        resolve({
          success: false,
          latency: Date.now() - startTime,
          error: `Failed to import Socket.IO client: ${importError.message}`,
          transport: 'websocket'
        });
      });
      
    } catch (error) {
      resolve({
        success: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        transport: 'websocket'
      });
    }
  });
}

/**
 * Test API endpoint connectivity
 */
export async function testApiConnection(endpoint: string = '/api/health'): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const latency = Date.now() - startTime;
    
    return {
      success: true,
      latency,
      details: data
    };
  } catch (error) {
    return {
      success: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Comprehensive connection test
 */
export async function runComprehensiveTest(): Promise<{
  api: ConnectionTestResult;
  socketHealth: SocketConnectionTestResult;
  socketWebSocket: SocketConnectionTestResult;
  overall: {
    success: boolean;
    totalLatency: number;
    errors: string[];
  };
}> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  // Run all tests in parallel
  const [api, socketHealth, socketWebSocket] = await Promise.all([
    testApiConnection(),
    testSocketConnection(),
    testSocketWebSocketConnection()
  ]);
  
  // Collect errors
  if (!api.success && api.error) errors.push(`API: ${api.error}`);
  if (!socketHealth.success && socketHealth.error) errors.push(`Socket Health: ${socketHealth.error}`);
  if (!socketWebSocket.success && socketWebSocket.error) errors.push(`Socket WebSocket: ${socketWebSocket.error}`);
  
  const totalLatency = Date.now() - startTime;
  const overallSuccess = api.success && socketHealth.success && socketWebSocket.success;
  
  return {
    api,
    socketHealth,
    socketWebSocket,
    overall: {
      success: overallSuccess,
      totalLatency,
      errors
    }
  };
}

/**
 * Connection quality assessment
 */
export function assessConnectionQuality(latency: number): {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  description: string;
} {
  if (latency < 100) {
    return {
      quality: 'excellent',
      color: 'text-green-600',
      description: 'Excellent connection quality'
    };
  } else if (latency < 300) {
    return {
      quality: 'good',
      color: 'text-blue-600',
      description: 'Good connection quality'
    };
  } else if (latency < 1000) {
    return {
      quality: 'fair',
      color: 'text-yellow-600',
      description: 'Fair connection quality'
    };
  } else {
    return {
      quality: 'poor',
      color: 'text-red-600',
      description: 'Poor connection quality'
    };
  }
}
