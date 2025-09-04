import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Find order by Stripe session ID
    const order = await Order.findOne({
      stripeSessionId: sessionId,
      userId: session.user.id,
    }).populate('items.productId');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Format order data
    const orderData = {
      id: order._id,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: order.totalAmount,
      currency: order.currency,
      status: order.status,
      createdAt: order.createdAt,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
    };

    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
