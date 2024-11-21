import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
  console.log('Received request:', event.httpMethod, event.body);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
    }

    const { priceId, userId } = JSON.parse(event.body || '{}');
    console.log('Parsed request body:', { priceId, userId });

    if (!priceId || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    // Get user from Supabase
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user?.email) {
      console.error('User error:', userError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Get or create Stripe customer
    let customer;
    const customers = await stripe.customers.list({ email: userData.user.email });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: { userId },
      });
    }

    // Get price from Stripe
    const price = await stripe.prices.retrieve(priceId);
    if (!price?.unit_amount) {
      throw new Error('Invalid price');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: 'usd',
      customer: customer.id,
      metadata: {
        userId,
        priceId,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method_types: ['card'],
    });

    console.log('Created payment intent:', paymentIntent.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error) {
    console.error('Payment intent error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Failed to create payment intent',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 