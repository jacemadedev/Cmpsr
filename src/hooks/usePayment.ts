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
        throw new Error('error' in data ? data.error : 'Failed to create payment intent');
      }
      
      return data as PaymentResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };

  return { createPaymentIntent };
}; 