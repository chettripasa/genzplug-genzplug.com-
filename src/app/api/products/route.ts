import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// Fallback sample products when database is not available
const fallbackProducts = [
  {
    _id: '1',
    name: 'Gaming Headset Pro',
    description: 'High-quality gaming headset with noise cancellation and RGB lighting',
    price: 129.99,
    currency: 'USD',
    category: 'gaming',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'],
    inStock: true,
    stockQuantity: 10,
    tags: ['gaming', 'audio', 'headset'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'RGB Gaming Mouse',
    description: 'Precision gaming mouse with customizable RGB lighting and programmable buttons',
    price: 89.99,
    currency: 'USD',
    category: 'gaming',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'],
    inStock: true,
    stockQuantity: 15,
    tags: ['gaming', 'mouse', 'rgb'],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Mechanical Gaming Keyboard',
    description: 'Premium mechanical keyboard with tactile switches and backlighting',
    price: 149.99,
    currency: 'USD',
    category: 'gaming',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop'],
    inStock: true,
    stockQuantity: 8,
    tags: ['gaming', 'keyboard', 'mechanical'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not available, returning fallback products');
      return NextResponse.json(fallbackProducts);
    }

    await dbConnect();
    
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    // Return fallback products if database connection fails
    console.warn('Database connection failed, returning fallback products');
    return NextResponse.json(fallbackProducts);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category' },
        { status: 400 }
      );
    }
    
    const newProduct = new Product({
      name: body.name,
      description: body.description,
      price: body.price,
      currency: body.currency || 'USD',
      images: body.images || [],
      category: body.category,
      inStock: body.inStock !== undefined ? body.inStock : true,
      stockQuantity: body.stockQuantity || 0,
      tags: body.tags || [],
      featured: body.featured || false,
      discountPercentage: body.discountPercentage,
      originalPrice: body.originalPrice,
      stripeProductId: body.stripeProductId,
      stripePriceId: body.stripePriceId,
    });
    
    const savedProduct = await newProduct.save();
    
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
