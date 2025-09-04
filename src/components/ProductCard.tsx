'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IProduct } from '@/models/Product';
import { useCart } from '@/lib/cart-context';
import { formatAmountForDisplay } from '@/lib/stripe';

interface ProductCardProps {
  product: IProduct;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const currentQuantity = getItemQuantity((product._id as string).toString());

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Product Image */}
      <div className="relative h-48 w-full">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discountPercentage}%
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}
        
        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
          {product.stockQuantity > 0 && (
            <span className="text-xs text-green-600">In Stock ({product.stockQuantity})</span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.discountPercentage ? (
              <>
                <span className="text-xl font-bold text-gray-900">
                  {formatAmountForDisplay(discountedPrice, product.currency)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatAmountForDisplay(product.price, product.currency)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                {formatAmountForDisplay(product.price, product.currency)}
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {currentQuantity > 0 ? (
            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={() => addItem(product, -1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                -
              </button>
              <span className="text-gray-700 font-medium">{currentQuantity}</span>
              <button
                onClick={() => addItem(product, 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                !product.inStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              }`}
            >
              {isAdding ? 'Added!' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
