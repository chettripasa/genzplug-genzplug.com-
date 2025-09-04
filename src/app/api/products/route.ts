import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const sampleProducts = [
  {
    _id: '1',
    name: 'Gaming Headset Pro',
    description: 'High-quality gaming headset with noise cancellation and RGB lighting',
    price: 129.99,
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'RGB Gaming Mouse',
    description: 'Precision gaming mouse with customizable RGB lighting and programmable buttons',
    price: 89.99,
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Mechanical Gaming Keyboard',
    description: 'Premium mechanical keyboard with tactile switches and backlighting',
    price: 149.99,
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop'],
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Database connection error:', error);
    // Return sample data if database is not available
    return NextResponse.json(sampleProducts);
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
