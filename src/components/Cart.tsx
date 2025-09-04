'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { formatAmountForDisplay } from '@/lib/stripe';
import { useSession } from 'next-auth/react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { data: session } = useSession();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = '/auth/signin';
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.discountPercentage 
              ? item.product.price * (1 - item.product.discountPercentage / 100)
              : item.product.price,
            quantity: item.quantity,
            image: item.product.images[0],
          })),
          totalAmount: state.total,
          currency: state.items[0]?.product.currency || 'USD',
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={(item.product._id as string).toString()} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatAmountForDisplay(
                          item.product.discountPercentage 
                            ? item.product.price * (1 - item.product.discountPercentage / 100)
                            : item.product.price,
                          item.product.currency
                        )}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity((item.product._id as string).toString(), item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity((item.product._id as string).toString(), item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                                                onClick={() => removeItem((item.product._id as string).toString())}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>{formatAmountForDisplay(state.total, state.items[0]?.product.currency || 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatAmountForDisplay(state.total, state.items[0]?.product.currency || 'USD')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
