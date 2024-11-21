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

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      event.headers['stripe-signature']!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Webhook event:', stripeEvent.type);

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const priceId = paymentIntent.metadata.priceId;

        // First, deactivate any existing subscriptions
        const { error: deactivateError } = await supabase
          .from('subscriptions')
          .update({ status: 'inactive' })
          .eq('user_id', userId)
          .eq('status', 'active');

        if (deactivateError) {
          console.error('Error deactivating old subscriptions:', deactivateError);
        }

        // Then create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: paymentIntent.customer as string,
            stripe_subscription_id: paymentIntent.id,
            price_id: priceId,
            status: 'active',
            current_period_end: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          });

        if (insertError) {
          console.error('Error creating new subscription:', insertError);
          throw insertError;
        }
        break;

      // Handle other events as needed
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