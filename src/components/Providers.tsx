'use client';

import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/lib/socket-client';
import { CartProvider } from '@/lib/cart-context';

export default function Providers({ children }: { children: React.ReactNode }) {
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
