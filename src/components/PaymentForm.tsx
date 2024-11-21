import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { usePayment } from '../hooks/usePayment';
import { Plan } from '../types/plan';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import type { StripePaymentElementOptions } from '@stripe/stripe-js';

interface PaymentFormProps {
  selectedPlan: Plan | null;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ selectedPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { createPaymentIntent } = usePayment({ selectedPlan });
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not been initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Please log in first');
      }

      if (!selectedPlan) {
        throw new Error('Please select a plan');
      }

      const { clientSecret } = await createPaymentIntent();
      
      if (!clientSecret) {
        throw new Error('Failed to initialize payment');
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?success=true`,
          payment_method_data: {
            billing_details: {
              email: user.email || undefined,
            },
          },
        },
      });

      if (confirmError) {
        throw confirmError;
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while processing your payment'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                email: user?.email || undefined,
              }
            }
          } as StripePaymentElementOptions}
        />
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500" role="alert">
            {error}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isLoading || !stripe || !elements}
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
          'Pay Now'
        )}
      </button>
    </form>
  );
};

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => (
  <div className="error-container">
    <h2>Something went wrong with the payment form</h2>
    <pre>{error.message}</pre>
    <button onClick={() => window.location.reload()}>Try again</button>
  </div>
);

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: Error) => {
        console.error('Payment form error:', error);
        // You might want to log this to your error tracking service
      }}
    >
      <PaymentFormContent {...props} />
    </ErrorBoundary>
  );
}; 