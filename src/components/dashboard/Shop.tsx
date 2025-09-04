'use client';

import { useState } from 'react';

// Demo data for shop items
const shopItems = [
  {
    id: 1,
    name: "Cyberpunk Gaming Chair",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    rating: 4.8,
    reviews: 1247,
    category: "Furniture",
    inStock: true,
    discount: 25
  },
  {
    id: 2,
    name: "Neon RGB Gaming Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
    rating: 4.6,
    reviews: 892,
    category: "Accessories",
    inStock: true,
    discount: 25
  },
  {
    id: 3,
    name: "VR Gaming Headset",
    price: 399.99,
    originalPrice: 499.99,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=200&fit=crop",
    rating: 4.9,
    reviews: 2341,
    category: "VR",
    inStock: true,
    discount: 20
  },
  {
    id: 4,
    name: "Gaming Mouse Pad",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
    rating: 4.4,
    reviews: 567,
    category: "Accessories",
    inStock: false,
    discount: 25
  },
  {
    id: 5,
    name: "Neon LED Strip Lights",
    price: 49.99,
    originalPrice: 69.99,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
    rating: 4.7,
    reviews: 1234,
    category: "Lighting",
    inStock: true,
    discount: 29
  },
  {
    id: 6,
    name: "Gaming Desk Setup",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
    rating: 4.5,
    reviews: 789,
    category: "Furniture",
    inStock: true,
    discount: 20
  }
];

const categories = ["All", "Furniture", "Accessories", "VR", "Lighting", "Gaming"];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredItems = selectedCategory === "All" 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const cartItems = shopItems.filter(item => cart.includes(item.id));
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  const handleAddToCart = (itemId: number) => {
    if (!cart.includes(itemId)) {
      setCart([...cart, itemId]);
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter(id => id !== itemId));
  };

  const handleCheckout = () => {
    // Placeholder for Stripe checkout integration
    console.log('Proceeding to checkout with items:', cartItems);
    console.log('Total:', cartTotal);
  };

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
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <div 
            key={item.id} 
            className="glass rounded-xl overflow-hidden neon-border-blue animate-slide-in hover:scale-105 transition-transform duration-300 group" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
              />
              
              {/* Discount Badge */}
              {item.discount > 0 && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs px-2 py-1 rounded font-semibold">
                  -{item.discount}%
                </div>
              )}
              
              {/* Stock Status */}
              <div className="absolute top-2 right-2">
                {item.inStock ? (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    In Stock
                  </div>
                ) : (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
              
              {/* Category Badge */}
              <div className="absolute bottom-2 left-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black text-xs px-2 py-1 rounded font-semibold">
                {item.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-cyan-400 neon-glow-cyan">
                    ${item.price}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-gray-400">{item.rating}</span>
                  <span className="text-xs text-gray-500">({item.reviews})</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleAddToCart(item.id)}
                disabled={!item.inStock}
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${
                  item.inStock
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-black hover:from-blue-500 hover:to-purple-600 neon-border-blue'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
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
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-black bg-opacity-30 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-cyan-400 font-bold">${item.price}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id)}
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
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleCheckout}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-500 hover:to-cyan-600 transition-all duration-300 neon-border-green"
                    >
                      Proceed to Checkout
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
