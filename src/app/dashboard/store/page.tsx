'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { IProduct } from '@/models/Product';

interface Filters {
  search: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
}

export default function StorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    inStock: false,
    featured: false,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
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

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.discountPercentage 
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'tech', name: 'Technology' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'collectibles', name: 'Collectibles' },
    { id: 'software', name: 'Software' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GenZPlug Store
            </h1>
            <p className="text-gray-300 text-lg">
              Discover the latest gaming gear and tech accessories
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name, description, or tags..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: [Number(e.target.value), filters.priceRange[1]] 
                  })}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: [filters.priceRange[0], Number(e.target.value)] 
                  })}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Toggle Filters */}
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                  className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                />
                <span>Featured Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Products ({filteredProducts.length})
            </h2>
            <div className="text-gray-400">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={(product._id as string).toString()} product={product} />
            ))}
          </div>
        )}

        {/* Featured Section */}
        {!filters.featured && products.filter(p => p.featured).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                .filter(product => product.featured)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={(product._id as string).toString()} product={product} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
