'use client';

import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/lib/socket-client';
import { CartProvider } from '@/lib/cart-context';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Global Chrome extension protection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add isCheckout property to prevent Chrome extension errors
      (window as any).isCheckout = false;
      
      // Add error handling for Chrome extension messages
      const handleError = (event: ErrorEvent) => {
        if (event.message && event.message.includes('isCheckout')) {
          console.warn('Chrome extension error intercepted:', event.message);
          event.preventDefault();
          return false;
        }
      };
      
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        if (event.reason && event.reason.message && event.reason.message.includes('isCheckout')) {
          console.warn('Chrome extension promise rejection intercepted:', event.reason.message);
          event.preventDefault();
          return false;
        }
      };
      
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Cleanup
      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);
  return (
    <SessionProvider>
      <SocketProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
