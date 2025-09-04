import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
