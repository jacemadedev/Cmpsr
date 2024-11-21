export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  tokenLimit: number;
  features: string[];
  highlighted?: boolean;
} 