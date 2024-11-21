import type { PricingPlan } from './types';

const standardFeatures = [
  'Advanced chat interface',
  'Priority response time',
  'Unlimited chats',
  'Email support',
  'Custom API key support',
  'History export',
  'Team collaboration',
  'GPT-4 access',
  'API access',
];

export const PLAN_IDS = {
  FREE: 'free',
  BASIC: import.meta.env.VITE_STRIPE_BASIC_PLAN_ID,
  PRO: import.meta.env.VITE_STRIPE_PRO_PLAN_ID,
} as const;

export const PRICE_IDS = {
  BASIC: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
  PRO: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
} as const;

export const pricingPlans: PricingPlan[] = [
  {
    id: PLAN_IDS.FREE,
    name: 'Free',
    description: 'Perfect for trying out our services',
    price: 0,
    interval: 'monthly',
    tokenLimit: 10000,
    features: ['10,000 tokens per month', ...standardFeatures],
    stripePriceId: null,
  },
  {
    id: PLAN_IDS.BASIC,
    name: 'Basic',
    description: 'Great for regular users',
    price: 10,
    interval: 'monthly',
    tokenLimit: 100000,
    highlighted: true,
    features: ['100,000 tokens per month', ...standardFeatures],
    stripePriceId: PRICE_IDS.BASIC,
  },
  {
    id: PLAN_IDS.PRO,
    name: 'Pro',
    description: 'For power users and teams',
    price: 29,
    interval: 'monthly',
    tokenLimit: 500000,
    features: ['500,000 tokens per month', ...standardFeatures],
    stripePriceId: PRICE_IDS.PRO,
  },
];

export const getPlanByPriceId = (priceId: string): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.stripePriceId === priceId);
};

export const getPlanById = (planId: string): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.id === planId);
};
