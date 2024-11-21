import { HistoryList } from './HistoryList';
import { HistoryStats } from './HistoryStats';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { getHistory, deleteHistoryItem } from '@/lib/history';
import { useAuth } from '@/lib/auth';
import type { HistoryItem } from '@/lib/types';

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const data = await getHistory(user.id);
        setItems(data);
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) return null;

  return (
    <DashboardLayout currentPage="history">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">History</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            View and analyze your past API requests
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading history...</p>
          </div>
        ) : (
          <>
            <HistoryStats items={items} />
            <HistoryList
              items={items}
              onDelete={async (id) => {
                if (!user) return;
                try {
                  await deleteHistoryItem(id, user.id);
                  setItems(items.filter((item) => item.id !== id));
                } catch (err) {
                  console.error(err);
                  setError('Failed to delete item');
                }
              }}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
