import { NextRequest, NextResponse } from 'next/server';

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
    return NextResponse.json(sampleProducts);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
