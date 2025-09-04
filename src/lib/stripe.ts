import Stripe from 'stripe';

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  });
}

export { stripe };

export const getStripe = () => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return stripe;
};

export const formatAmountForDisplay = (amount: number, currency: string): string => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
};

export const formatAmountForStripe = (amount: number, currency: string): number => {
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const multiplier = currencies.includes(currency) ? 100 : 1;
  return Math.round(amount * multiplier);
};

export const createStripeProduct = async (productData: {
  name: string;
  description: string;
  images: string[];
  metadata?: Record<string, string>;
}) => {
  const stripe = getStripe();
  
  const product = await stripe.products.create({
    name: productData.name,
    description: productData.description,
    images: productData.images,
    metadata: productData.metadata,
  });
  
  return product;
};

export const createStripePrice = async (productId: string, priceData: {
  amount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
  };
}) => {
  const stripe = getStripe();
  
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: formatAmountForStripe(priceData.amount, priceData.currency),
    currency: priceData.currency.toLowerCase(),
    recurring: priceData.recurring,
  });
  
  return price;
};

export const createCheckoutSession = async (sessionData: {
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) => {
  const stripe = getStripe();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: sessionData.lineItems,
    mode: sessionData.mode,
    success_url: sessionData.successUrl,
    cancel_url: sessionData.cancelUrl,
    customer_email: sessionData.customerEmail,
    metadata: sessionData.metadata,
  });
  
  return session;
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  const stripe = getStripe();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

export const createPaymentIntent = async (paymentData: {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
}) => {
  const stripe = getStripe();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(paymentData.amount, paymentData.currency),
    currency: paymentData.currency.toLowerCase(),
    metadata: paymentData.metadata,
    receipt_email: paymentData.customerEmail,
  });
  
  return paymentIntent;
};
