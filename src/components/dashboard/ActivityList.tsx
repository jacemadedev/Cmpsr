import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryItem } from '@/lib/types';

interface ActivityListProps {
  items: HistoryItem[];
  loading?: boolean;
}

export function ActivityList({ items, loading = false }: ActivityListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-800"></div>
                <div className="mt-2 h-3 w-1/4 rounded bg-gray-100 dark:bg-neutral-900"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      {items.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">No recent activity</div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
