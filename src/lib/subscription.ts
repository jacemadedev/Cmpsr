import { supabase } from './supabase';
import type { UserSubscription } from './types';

export async function getSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    // First try to get existing subscription
    const { data: existingData, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // If subscription exists, return it
    if (existingData) {
      return {
        planId: existingData.plan_id,
        status: existingData.status,
        currentPeriodEnd: existingData.current_period_end,
        tokenLimit: existingData.token_limit,
        tokensUsed: existingData.tokens_used || 0,
        stripeCustomerId: existingData.stripe_customer_id,
        stripeSubscriptionId: existingData.stripe_subscription_id,
      };
    }

    // If no subscription exists, create a new free subscription
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setHours(0, 0, 0, 0); // Reset to start of day

    const { data: newData, error: insertError } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          plan_id: 'free',
          status: 'active',
          current_period_end: nextMonth.toISOString(),
          token_limit: 10000,
          tokens_used: 0,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    if (!newData) throw new Error('Failed to create subscription');

    return {
      planId: newData.plan_id,
      status: newData.status,
      currentPeriodEnd: newData.current_period_end,
      tokenLimit: newData.token_limit,
      tokensUsed: newData.tokens_used || 0,
      stripeCustomerId: newData.stripe_customer_id,
      stripeSubscriptionId: newData.stripe_subscription_id,
    };
  } catch (error) {
    console.error('Failed to fetch/create subscription:', error);
    throw error;
  }
}

export async function updateTokenUsage(userId: string, tokensUsed: number): Promise<void> {
  try {
    // First check if we need to reset the period
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('current_period_end, tokens_used')
      .eq('user_id', userId)
      .single();

    if (!subscription) throw new Error('No subscription found');

    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);

    // If current period has ended, reset usage and update period
    if (now > periodEnd) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setHours(0, 0, 0, 0);

      const { error: resetError } = await supabase
        .from('subscriptions')
        .update({
          tokens_used: tokensUsed,
          current_period_end: nextMonth.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('user_id', userId);

      if (resetError) throw resetError;
    } else {
      // Otherwise just increment the usage
      const { error } = await supabase.rpc('increment_token_usage', {
        user_id_input: userId,
        tokens_to_add: tokensUsed,
      });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Failed to update token usage:', error);
    throw error;
  }
}

export async function resetTokenUsage(userId: string): Promise<void> {
  try {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setHours(0, 0, 0, 0);

    const { error } = await supabase
      .from('subscriptions')
      .update({
        tokens_used: 0,
        current_period_end: nextMonth.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to reset token usage:', error);
    throw error;
  }
}
