'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { IProduct } from '@/models/Product';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: IProduct; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: IProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { product, quantity }],
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload.productId),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product._id !== productId),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        ),
      };
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    }
    
    case 'LOAD_CART': {
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    default:
      return state;
  }
};

const calculateTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => {
    const price = item.product.discountPercentage 
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { total, itemCount };
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('genzplug-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const { total, itemCount } = calculateTotals(state.items);
    const updatedState = { ...state, total, itemCount };
    
    localStorage.setItem('genzplug-cart', JSON.stringify(state.items));
    
    // Update state with calculated totals
    if (updatedState.total !== state.total || updatedState.itemCount !== state.itemCount) {
      dispatch({ type: 'LOAD_CART', payload: state.items });
    }
  }, [state.items, state.total, state.itemCount]);

  const addItem = (product: IProduct, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
