'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  featured: boolean;
  discountPercentage?: number;
  originalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

const categories = ["All", "gaming", "tech", "accessories", "clothing", "collectibles", "software"];

export default function Shop() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === 'All' 
        ? '/api/products' 
        : `/api/products?category=${selectedCategory}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const cartItems = products.filter(product => cart.includes(product._id));
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  const handleAddToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(id => id !== productId));
  };

  const handleCheckout = async () => {
    if (!session?.user) {
      alert('Please sign in to proceed with checkout');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.images[0] || ''
          })),
          totalAmount: cartTotal,
          currency: 'USD'
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        alert(error.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed');
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getDiscountPercentage = (product: Product) => {
    if (product.discountPercentage) {
      return product.discountPercentage;
    }
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold neon-glow-blue">Shop</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowCart(true)}
            className="relative px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-black font-semibold rounded-lg hover:from-blue-500 hover:to-purple-600 transition-all duration-300 neon-border-blue"
          >
            Cart ({cart.length})
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-slow">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-black neon-border-blue'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-xl text-gray-400">No products found</p>
            <p className="text-sm text-gray-500">Try a different category or check back later!</p>
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const discount = getDiscountPercentage(product);
            return (
              <div 
                key={product._id} 
                className="glass rounded-xl overflow-hidden neon-border-blue animate-slide-in hover:scale-105 transition-transform duration-300 group" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={product.images[0] || '/placeholder-product.jpg'} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs px-2 py-1 rounded font-semibold">
                      -{discount}%
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  <div className="absolute top-2 right-2">
                    {product.inStock ? (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                        In Stock ({product.stockQuantity})
                      </div>
                    ) : (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-2 left-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black text-xs px-2 py-1 rounded font-semibold">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </div>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded font-semibold">
                      ⭐ Featured
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-cyan-400 neon-glow-cyan">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice, product.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    disabled={!product.inStock}
                    className={`w-full px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-black hover:from-blue-500 hover:to-purple-600 neon-border-blue'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-8 max-w-2xl w-full mx-4 neon-border-blue">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white neon-glow-blue">Shopping Cart</h3>
              <button 
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 bg-black bg-opacity-30 rounded-lg">
                    <img 
                      src={item.images[0] || '/placeholder-product.jpg'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded" 
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-cyan-400 font-bold">{formatPrice(item.price, item.currency)}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-cyan-400 neon-glow-cyan">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleCheckout}
                      disabled={!session?.user}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 neon-border-green"
                    >
                      {session?.user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                    </button>
                    <button 
                      onClick={() => setCart([])}
                      className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-black font-semibold rounded-lg hover:from-red-500 hover:to-pink-600 transition-all duration-300 neon-border-pink"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}