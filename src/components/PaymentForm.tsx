import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import type { PricingPlan } from '@/lib/types';

interface PaymentFormProps {
  selectedPlan: PricingPlan | null;
}

export function PaymentForm({ selectedPlan }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const handleCheckout = async () => {
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    if (!selectedPlan?.stripePriceId) {
      setError('Invalid plan selected. Please try again.');
      console.error('Missing stripePriceId for plan:', selectedPlan);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating checkout session for:', {
        userId: user.id,
        priceId: selectedPlan.stripePriceId,
        planName: selectedPlan.name
      });

      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.stripePriceId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const { url, error: checkoutError } = data;

      if (checkoutError || !url) {
        throw new Error(checkoutError || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      console.log('Redirecting to checkout:', url);
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to initialize checkout'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {selectedPlan ? (
          <p>
            You selected the <strong>{selectedPlan.name}</strong> plan at{' '}
            <strong>${selectedPlan.price}/month</strong>
          </p>
        ) : (
          <p>Please select a plan to continue</p>
        )}
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading || !user || !selectedPlan?.stripePriceId}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Upgrade Now'
        )}
      </button>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Secure payment powered by Stripe
      </p>
    </div>
  );
} 