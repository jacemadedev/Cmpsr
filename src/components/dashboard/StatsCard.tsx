import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  progress?: number;
  badge?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  progress,
  badge,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">{title}</p>
            {badge && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="rounded-full bg-blue-50 p-3 dark:bg-neutral-900">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-900">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={cn(
                'h-full transition-colors',
                progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-blue-500'
              )}
            />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">{progress.toFixed(1)}%</span>
        </div>
      )}
      
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span
            className={cn(
              'mr-2',
              trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
        <span className="text-gray-600 dark:text-neutral-400">{description}</span>
      </div>
    </motion.div>
  );
}