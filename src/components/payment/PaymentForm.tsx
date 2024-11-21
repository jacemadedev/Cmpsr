import { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PricingPlan } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { usePayment } from './usePayment';

interface PaymentFormProps {
  plan: PricingPlan;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ plan, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createPaymentIntent, error: paymentError } = usePayment();

  useEffect(() => {
    if (paymentError) {
      onError(paymentError);
    }
  }, [paymentError, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      onError('Payment configuration is incomplete');
      return;
    }

    if (!user.email) {
      onError('Please verify your email address before proceeding');
      return;
    }

    setLoading(true);

    try {
      // Get client secret
      const clientSecret = await createPaymentIntent(plan, user.id);

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Submit form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?success=true`,
          receipt_email: user.email, // Add email for receipt
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      onSuccess();
    } catch (err) {
      const error = err as Error;
      onError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-8">
      {/* Plan Summary */}
      <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name} Plan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly subscription</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Includes:</p>
          <ul className="space-y-2">
            {plan.features.slice(0, 3).map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="h-1 w-1 rounded-full bg-blue-600" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Details</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            Secured by Stripe
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
          <PaymentElement />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!stripe || loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay ${plan.price.toFixed(2)}
          </>
        )}
      </motion.button>

      {/* Terms */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        By confirming your subscription, you allow {plan.name} Plan to charge your card for this
        payment and future payments in accordance with their terms.{' '}
        <button type="button" className="text-blue-600 hover:underline dark:text-blue-400">
          View Terms
        </button>
      </p>
    </form>
  );
}
