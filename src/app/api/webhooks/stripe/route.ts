import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

interface StripeSession {
  metadata?: { orderId?: string };
  payment_intent?: string;
}

interface StripePaymentIntent {
  metadata?: { orderId?: string };
}

interface StripeInvoice {
  id: string;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await dbConnect();

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as StripeSession);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as StripePaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as StripePaymentIntent);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as StripeInvoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as StripeInvoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: StripeSession) {
  const orderId = session.metadata?.orderId;
  
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      status: 'completed',
      stripePaymentIntentId: session.payment_intent,
    });
    
    console.log(`Order ${orderId} marked as completed`);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: StripePaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      status: 'completed',
    });
    
    console.log(`Order ${orderId} payment succeeded`);
  }
}

async function handlePaymentIntentFailed(paymentIntent: StripePaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      status: 'cancelled',
    });
    
    console.log(`Order ${orderId} payment failed`);
  }
}

async function handleInvoicePaymentSucceeded(invoice: StripeInvoice) {
  // Handle subscription payments
  console.log('Subscription payment succeeded:', invoice.id);
}

async function handleInvoicePaymentFailed(invoice: StripeInvoice) {
  // Handle failed subscription payments
  console.log('Subscription payment failed:', invoice.id);
}
