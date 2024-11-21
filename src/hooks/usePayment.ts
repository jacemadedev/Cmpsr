import { useUser } from './useUser';
import { useSession } from './useSession';
import { Plan } from '../types/plan';
import { SupabaseSession } from '../types/supabase';

interface UsePaymentProps {
  selectedPlan: Plan | null;
}

interface PaymentResponse {
  clientSecret: string;
}

interface PaymentError {
  error: string;
  details?: unknown;
}

export const usePayment = ({ selectedPlan }: UsePaymentProps) => {
  const { user } = useUser();
  const { session } = useSession();

  const createPaymentIntent = async (): Promise<PaymentResponse> => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    if (!selectedPlan?.priceId) {
      throw new Error('Invalid plan selected');
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(session as SupabaseSession)?.access_token}`
          },
          body: JSON.stringify({
            userId: user.id,
            priceId: selectedPlan.priceId
          }),
        });

        const data = await response.json() as PaymentResponse | PaymentError;
        
        if (!response.ok) {
          console.error('Payment intent failed:', {
            status: response.status,
            statusText: response.statusText,
            data
          });
          throw new Error('error' in data ? data.error : `Failed to create payment intent (${response.status})`);
        }
        
        return data as PaymentResponse;
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          console.error('Payment intent failed after retries:', error);
          throw error instanceof Error ? error : new Error('Failed to create payment intent');
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Failed to create payment intent after retries');
  };

  return { createPaymentIntent };
}; 