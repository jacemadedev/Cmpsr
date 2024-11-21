import { Crown, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { pricingPlans } from '@/lib/pricing';

interface SubscriptionCardProps {
  currentPlan: string;
  onUpgrade: () => void;
}

export function SubscriptionCard({ currentPlan, onUpgrade }: SubscriptionCardProps) {
  const plan = pricingPlans.find((p) => p.id === currentPlan);
  const nextPlan = pricingPlans.find((p) => p.price > (plan?.price || 0));

  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {plan.name} Plan
              </h3>
              {plan.highlighted && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  Popular
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Zap className="h-4 w-4" />
              {plan.tokenLimit.toLocaleString()} tokens per month
            </div>
          </div>
        </div>

        {nextPlan && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <span>Upgrade to {nextPlan.name}</span>
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {plan.features.slice(0, 6).map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-neutral-900 dark:text-gray-400"
          >
            <div className="h-1 w-1 rounded-full bg-blue-600" />
            {feature}
          </div>
        ))}
      </div>

      {plan.id === 'free' && (
        <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Upgrade to unlock more features and higher token limits
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/40">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(plan.tokenLimit / 500000) * 100}%` }}
              />
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {((plan.tokenLimit / 500000) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}