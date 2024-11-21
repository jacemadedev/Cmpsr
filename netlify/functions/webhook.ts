import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define plan configuration directly in the webhook handler
const PLAN_CONFIG: Record<string, { id: string; tokenLimit: number }> = {
  [process.env.VITE_STRIPE_BASIC_PRICE_ID!]: { id: 'basic', tokenLimit: 100000 },
  [process.env.VITE_STRIPE_PRO_PRICE_ID!]: { id: 'pro', tokenLimit: 500000 },
};

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    let stripeEvent;
    
    if (process.env.NODE_ENV === 'development') {
      // In development, parse the raw body without verification
      stripeEvent = JSON.parse(event.body!);
      console.log('Development mode - skipping signature verification');
    } else {
      // In production, verify the signature
      stripeEvent = stripe.webhooks.constructEvent(
        event.body!,
        event.headers['stripe-signature']!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    }

    console.log('Webhook event:', stripeEvent.type);

    // Handle checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      const userId = session.metadata?.userId;
      const priceId = session.metadata?.priceId;

      if (!userId || !priceId) {
        console.error('Missing metadata in session:', session.id);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing metadata' })
        };
      }

      // Get the plan configuration
      const planConfig = PLAN_CONFIG[priceId];
      if (!planConfig) {
        console.error('Unknown price ID:', priceId);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid price ID' })
        };
      }

      console.log('Creating subscription with plan:', {
        userId,
        priceId,
        planId: planConfig.id,
        tokenLimit: planConfig.tokenLimit
      });

      // First, deactivate any existing subscriptions
      const { error: deactivateError } = await supabase
        .from('subscriptions')
        .update({ status: 'inactive' })
        .eq('user_id', userId)
        .neq('status', 'canceled');

      if (deactivateError) {
        console.error('Error deactivating old subscriptions:', deactivateError);
      }

      // Then create new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          price_id: priceId,
          plan_id: planConfig.id,
          status: 'active',
          token_limit: planConfig.tokenLimit,
          tokens_used: 0,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (insertError) {
        console.error('Error creating new subscription:', insertError);
        throw insertError;
      }

      console.log('Successfully created subscription for user:', userId);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Webhook Error',
      }),
    };
  }
};