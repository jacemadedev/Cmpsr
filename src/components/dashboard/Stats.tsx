import { Brain, Clock, Gauge } from 'lucide-react';
import { StatsCard } from './StatsCard';
import type { UserSubscription } from '@/lib/types';
import { pricingPlans, PRICE_IDS } from '@/lib/pricing';

const DEFAULT_TOKEN_LIMIT = 10000;

interface StatsProps {
  subscription: UserSubscription | null;
}

export function Stats({ subscription }: StatsProps) {
  // Use default values if subscription is null
  const tokenLimit = subscription?.token_limit ?? DEFAULT_TOKEN_LIMIT;
  const tokensUsed = subscription?.tokens_used ?? 0;
  const currentPeriodEnd = subscription?.current_period_end ?? new Date().toISOString();
  
  // Map price_id to plan
  let planId = 'free';
  if (subscription?.price_id === PRICE_IDS.BASIC) {
    planId = 'basic';
  } else if (subscription?.price_id === PRICE_IDS.PRO) {
    planId = 'pro';
  }

  const tokensLeft = Math.max(0, tokenLimit - tokensUsed);
  const usagePercentage = Math.min(100, (tokensUsed / tokenLimit) * 100);
  const plan = pricingPlans.find((p) => p.id === planId);

  // Calculate days until reset
  const periodEnd = new Date(currentPeriodEnd);
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  console.log('Stats component subscription state:', {
    subscription,
    planId,
    plan,
    tokenLimit,
    tokensUsed,
    priceId: subscription?.price_id,
    rawSubscription: JSON.stringify(subscription, null, 2)
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Monthly Usage"
        value={`${tokensUsed.toLocaleString()} / ${tokenLimit.toLocaleString()}`}
        description={`${usagePercentage.toFixed(1)}% of your ${plan?.name || 'Free'} plan limit`}
        icon={Brain}
        trend={tokensUsed > tokenLimit * 0.8 ? 'down' : 'up'}
        progress={usagePercentage}
      />
      <StatsCard
        title="Available Tokens"
        value={tokensLeft.toLocaleString()}
        description={`Reset in ${daysLeft} days`}
        icon={Gauge}
        trend={tokensLeft < tokenLimit * 0.2 ? 'down' : undefined}
      />
      <StatsCard
        title="Current Plan"
        value={plan?.name || 'Free'}
        description={`${tokenLimit.toLocaleString()} tokens per month`}
        icon={Clock}
        trend={plan?.highlighted ? 'up' : undefined}
        badge={plan?.highlighted ? 'Popular' : undefined}
      />
    </div>
  );
}