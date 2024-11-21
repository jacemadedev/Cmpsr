export interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface Chat {
  id: number;
  title: string;
  messages: Message[];
  model: string;
  tokensUsed: number;
  lastActive: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  type: 'chat' | 'completion';
  model: string;
  title: string;
  tokens_used: number;
  response_time: string;
  created_at: string;
  status: 'success' | 'error';
  messages?: Message[];
  prompt?: string;
  completion?: string;
}

export type HistoryItemInsert = Omit<HistoryItem, 'id' | 'created_at'>;

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  tokenLimit: number;
  features: string[];
  stripePriceId: string | null;
  highlighted?: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  price_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired';
  current_period_end: string;
  token_limit: number;
  tokens_used: number;
}

export interface Subscription {
  planId: string;
  status: string;
  tokenLimit: number;
  tokensUsed: number;
  currentPeriodEnd: string;
}
