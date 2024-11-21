import { supabase } from './supabase';
import type { UserSubscription } from './types';

export const getSubscription = async (userId: string): Promise<UserSubscription | null> => {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }

    const subscription = subscriptions?.[0] || null;
    console.log('Fetched subscription for user:', userId, subscription);
    return subscription;
  } catch (error) {
    console.error('Error in getSubscription:', error);
    throw error;
  }
};

export const updateSubscription = async (userId: string, subscription: Partial<UserSubscription>) => {
  try {
    // First, deactivate all existing active subscriptions
    await supabase
      .from('subscriptions')
      .update({ status: 'inactive' })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Then create the new subscription
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        ...subscription,
        status: 'active',
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

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
