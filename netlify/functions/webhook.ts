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
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;
        const priceId = subscription.items.data[0].price.id;

        // Get price details from Stripe
        const price = await stripe.prices.retrieve(priceId);
        const product = await stripe.products.retrieve(price.product as string);

        // First, deactivate any existing subscriptions
        const { error: deactivateError } = await supabase
          .from('subscriptions')
          .update({ status: 'inactive' })
          .eq('user_id', userId)
          .eq('status', 'active');

        if (deactivateError) {
          console.error('Error deactivating old subscriptions:', deactivateError);
        }

        // Calculate token limit based on the plan
        const tokenLimit = product.metadata.token_limit ? 
          parseInt(product.metadata.token_limit) : 
          10000;

        // Then create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            price_id: priceId,
            plan_id: product.id,
            status: subscription.status === 'active' ? 'active' : 'incomplete',
            token_limit: tokenLimit,
            tokens_used: 0,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (insertError) {
          console.error('Error creating new subscription:', insertError);
          throw insertError;
        }

        console.log('Successfully updated subscription for user:', userId, {
          plan: product.name,
          tokenLimit,
          priceId,
          status: subscription.status
        });

        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = stripeEvent.data.object as Stripe.Subscription;

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', deletedSubscription.id);

        if (updateError) {
          console.error('Error updating subscription status:', updateError);
          throw updateError;
        }

        console.log('Successfully canceled subscription:', deletedSubscription.id);
        break;
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