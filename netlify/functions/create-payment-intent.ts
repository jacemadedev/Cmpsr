import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const handler: Handler = async (event) => {
  console.log('Function started with event:', {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
  });

  // Log all environment variables (without values)
  console.log('Available environment variables:', {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV
  });

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  try {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing required environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          debug: {
            stripe: !!process.env.STRIPE_SECRET_KEY,
            supabaseUrl: !!process.env.VITE_SUPABASE_URL,
            supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
          }
        })
      };
    }

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse and validate request body
    let priceId, userId;
    try {
      const parsedBody = JSON.parse(event.body || '{}');
      priceId = parsedBody.priceId;
      userId = parsedBody.userId;
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    if (!priceId || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Get user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      console.error('User error:', userError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User not found' })
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

    // Create payment intent with automatic_payment_methods
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
        allow_redirects: 'always'
      },
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
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      })
    };
  }
}; 