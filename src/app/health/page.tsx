'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/lib/socket-client';

interface HealthStatus {
  status: string;
  timestamp: string;
  environment: string;
  message: string;
  responseTime: string;
  services: {
    api: {
      status: string;
      responseTime: string;
    };
    socketServer: {
      status: string;
      latency: string;
      url: string;
    };
  };
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  version: string;
}

export default function HealthPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const { socket, isConnected, connectionStatus, reconnectAttempts } = useSocket();

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setHealthStatus(data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ok':
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'error':
      case 'disconnected':
        return 'text-red-600 bg-red-100';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-100';
      case 'unreachable':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">System Health Dashboard</h1>
              <button
                onClick={checkHealth}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>

            {lastChecked && (
              <p className="text-sm text-gray-500 mb-6">
                Last checked: {lastChecked.toLocaleString()}
              </p>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Health Check Failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Socket.IO Connection Status */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Socket.IO Connection Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Connection Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(connectionStatus)}`}>
                      {connectionStatus}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      Connected: {isConnected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {reconnectAttempts > 0 && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-600">
                        Reconnect attempts: {reconnectAttempts}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Socket Instance</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${socket ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                      {socket ? 'Initialized' : 'Not Available'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      Socket ID: {socket?.id || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* API Health Status */}
            {healthStatus && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">API Health Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Overall Status</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(healthStatus.status)}`}>
                          {healthStatus.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          Response Time: {healthStatus.responseTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Environment</span>
                        <span className="text-sm text-gray-600">{healthStatus.environment}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          Version: {healthStatus.version}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Uptime</span>
                        <span className="text-sm text-gray-600">{formatUptime(healthStatus.uptime)}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          Memory: {formatBytes(healthStatus.memory.heapUsed)} / {formatBytes(healthStatus.memory.heapTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Status */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Services Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">API Service</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(healthStatus.services.api.status)}`}>
                            {healthStatus.services.api.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Response Time:</span>
                          <span className="text-sm text-gray-600">{healthStatus.services.api.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Socket.IO Server</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(healthStatus.services.socketServer.status)}`}>
                            {healthStatus.services.socketServer.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Latency:</span>
                          <span className="text-sm text-gray-600">{healthStatus.services.socketServer.latency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">URL:</span>
                          <span className="text-sm text-gray-600 break-all">{healthStatus.services.socketServer.url}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
