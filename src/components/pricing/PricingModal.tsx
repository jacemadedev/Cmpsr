import { useState } from 'react';
import { X, Check, Zap, AlertCircle, Loader2, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pricingPlans } from '@/lib/pricing';
import { useAuth } from '@/lib/auth';
import { PaymentForm } from '../payment/PaymentForm';
import { StripeProvider } from '../payment/StripeProvider';
import { getSubscription } from '@/lib/subscription';
import { useStore } from '@/lib/store';
import type { PricingPlan } from '@/lib/types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export function PricingModal({ isOpen, onClose, currentPlan = 'free' }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { setSubscription } = useStore();

  if (!isOpen) return null;

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!user) {
      setError('Please sign in to select a plan');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (plan.id === 'free') {
        // Handle free plan selection
        const subscription = await getSubscription(user.id);
        if (subscription) {
          setSubscription(subscription);
          onClose();
          return;
        }
      }

      if (!plan.stripePriceId) {
        setError('This plan is not available for purchase');
        return;
      }

      setSelectedPlan(plan);
    } catch (err) {
      console.error('Failed to select plan:', err);
      setError('Failed to select plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onClose();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setSelectedPlan(null);
  };

  const renderPlanButton = (plan: PricingPlan) => {
    const isCurrentPlan = currentPlan === plan.id;
    const isDowngrade = plan.price < (pricingPlans.find(p => p.id === currentPlan)?.price || 0);

    if (isCurrentPlan) {
      return (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <Crown className="h-4 w-4" />
          Current Plan
        </div>
      );
    }

    return (
      <button
        onClick={() => handleSelectPlan(plan)}
        disabled={loading || isCurrentPlan}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
          loading
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
            : plan.highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            {isDowngrade ? 'Downgrade to ' : 'Upgrade to '} {plan.name}
          </>
        )}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white dark:bg-gray-900"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {selectedPlan ? 'Complete Your Purchase' : 'Upgrade Your Plan'}
              </h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {selectedPlan
                  ? 'Enter your payment details to subscribe'
                  : 'Choose the perfect plan for your needs'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedPlan ? (
            <StripeProvider amount={selectedPlan?.price ? selectedPlan.price * 100 : undefined}>
              <PaymentForm
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-2xl border ${
                    plan.id === currentPlan
                      ? 'border-blue-600 dark:border-blue-500'
                      : plan.highlighted
                      ? 'border-blue-200 dark:border-blue-800'
                      : 'border-gray-200 dark:border-gray-800'
                  } ${
                    plan.highlighted
                      ? 'bg-blue-50/50 dark:bg-blue-900/20'
                      : 'bg-white dark:bg-gray-900'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                      Popular
                    </div>
                  )}

                  {plan.id === currentPlan && (
                    <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                      <Crown className="h-3 w-3" />
                      Current
                    </div>
                  )}

                  <div className="p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">{renderPlanButton(plan)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All plans include automatic monthly renewals.{' '}
            <button className="text-blue-600 hover:underline dark:text-blue-400">View Terms</button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}