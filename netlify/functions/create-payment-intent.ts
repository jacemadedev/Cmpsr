import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
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

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const { priceId, userId } = JSON.parse(event.body || '{}');

    if (!priceId || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    // Get user email from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !userData?.email) {
      throw new Error('User not found or missing email');
    }

    // Get price from Stripe
    const price = await stripe.prices.retrieve(priceId);
    if (!price?.unit_amount) {
      throw new Error('Invalid price');
    }

    // Create or get customer
    let customer;
    const customers = await stripe.customers.list({ email: userData.email });
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userData.email,
        metadata: { userId },
      });
    }

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
        error: import.meta.env.DEV ? error : undefined,
      }),
    };
  }
}; 