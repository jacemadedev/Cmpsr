import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { usePayment } from '../hooks/usePayment';
import { Plan } from '../types/plan';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

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

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <button 
        type="submit" 
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
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