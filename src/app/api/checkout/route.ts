import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount, currency } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Create order in database
    const order = new Order({
      userId: session.user.id,
      items: items.map((item: CartItem) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      currency,
      status: 'pending',
      customerEmail: session.user.email || undefined,
      customerName: session.user.name || undefined,
    });

    await order.save();

    // Create Stripe checkout session
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await createCheckoutSession({
      lineItems,
      mode: 'payment',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      customerEmail: session.user.email || undefined,
      metadata: {
        orderId: order._id.toString(),
        userId: session.user.id,
      },
    });

    // Update order with Stripe session ID
    order.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
