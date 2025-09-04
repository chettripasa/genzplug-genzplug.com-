import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Database connection error:', error);
    // Return sample data if database is not available
    return NextResponse.json([
      {
        _id: '1',
        name: 'Sample Gaming Headset',
        description: 'High-quality gaming headset with noise cancellation',
        price: 99.99,
        category: 'electronics',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Gaming Mouse',
        description: 'Precision gaming mouse with RGB lighting',
        price: 79.99,
        category: 'electronics',
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'],
        createdAt: new Date().toISOString()
      }
    ]);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
