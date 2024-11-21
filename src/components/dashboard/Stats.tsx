import { Brain, Clock, Gauge } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { getSubscription } from '@/lib/subscription';
import { useStore } from '@/lib/store';
import { pricingPlans } from '@/lib/pricing';

export function Stats() {
  const { user } = useAuth();
  const { subscription, setSubscription } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: number;

    const loadSubscription = async () => {
      if (!user) return;

      try {
        const data = await getSubscription(user.id);
        if (mounted && data) {
          setSubscription(data);
        }
        if (mounted) {
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load subscription:', err);
        if (mounted) {
          setError('Failed to load subscription data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initial load
    loadSubscription();

    // Poll for updates every 5 seconds to keep usage stats current
    intervalId = window.setInterval(loadSubscription, 5000);

    return () => {
      mounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [user, setSubscription]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black"
          >
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
        No active subscription found. Please select a plan to continue.
      </div>
    );
  }

  const { tokenLimit, tokensUsed, currentPeriodEnd, planId } = subscription;
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

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Monthly Usage"
        value={`${tokensUsed.toLocaleString()} / ${tokenLimit.toLocaleString()}`}
        description={`${usagePercentage.toFixed(1)}% of your ${plan?.name || ''} plan limit`}
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
        description={`${plan?.tokenLimit.toLocaleString()} tokens per month`}
        icon={Clock}
        trend={plan?.highlighted ? 'up' : undefined}
        badge={plan?.highlighted ? 'Popular' : undefined}
      />
    </div>
  );
}