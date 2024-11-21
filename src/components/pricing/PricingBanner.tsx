import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingBannerProps {
  tokensLeft: number;
  tokenLimit: number;
  onUpgrade: () => void;
}

export function PricingBanner({ tokensLeft, tokenLimit, onUpgrade }: PricingBannerProps) {
  const percentageUsed = ((tokenLimit - tokensLeft) / tokenLimit) * 100;
  const isLow = tokensLeft < tokenLimit * 0.2;

  if (!isLow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Running Low on Tokens</h3>
            <p className="text-blue-100">
              You've used {percentageUsed.toFixed(1)}% of your monthly limit
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpgrade}
          className="rounded-xl bg-white px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          Upgrade Now
        </motion.button>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-blue-100">
          {tokensLeft.toLocaleString()} tokens remaining this month
        </div>
      </div>
    </motion.div>
  );
}
