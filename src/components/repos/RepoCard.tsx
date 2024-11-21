import { Star, GitBranch, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface RepoCardProps {
  name: string;
  description: string;
  features: string[];
  stars: number;
  onLike: () => void;
  onFork: () => void;
  onPreview: () => void;
}

export function RepoCard({
  name,
  description,
  features,
  stars,
  onLike,
  onFork,
  onPreview,
}: RepoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className="flex items-center gap-1 text-yellow-500 transition-colors hover:text-yellow-600"
          >
            <Star className="h-5 w-5" />
            <span className="text-sm">{stars.toLocaleString()}</span>
          </motion.button>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      {/* Features */}
      <div className="mb-6 flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <Badge
            key={index}
            className="rounded-lg bg-blue-50 px-2 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
          >
            {feature}
          </Badge>
        ))}
      </div>

      {/* Info */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          <span>Vite</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>AI Wrappers</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPreview}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:hover:bg-neutral-900"
        >
          Preview
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFork}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Fork Repo
        </motion.button>
      </div>
    </motion.div>
  );
}