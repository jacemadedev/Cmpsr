import { Brain, MessageSquare, History, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-2xl shadow-black/5 dark:border-neutral-800/50 dark:bg-black"
    >
      {/* Window Controls */}
      <div className="flex h-8 items-center gap-2 border-b border-gray-200/50 bg-gray-100/50 px-4 dark:border-neutral-800/50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200/50 bg-gray-50/50 dark:border-neutral-800/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Command className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overview</p>
            </div>
          </div>
          <nav className="space-y-1 p-2">
            {[
              { icon: Brain, label: 'AI Chat' },
              { icon: MessageSquare, label: 'Messages' },
              { icon: History, label: 'History' },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.02 }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-black dark:hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { label: 'Total Requests', value: '2.4k', trend: '+12%' },
              { label: 'Response Time', value: '0.8s', trend: '-25%' },
              { label: 'Success Rate', value: '99.9%', trend: '+0.5%' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-gray-200/50 bg-white p-4 dark:border-neutral-800/50 dark:bg-black"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${
                      stat.trend.startsWith('+')
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {stat.trend}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-2">
              {[
                'API request completed in 0.6s',
                'New chat session started',
                'Successfully optimized component rendering',
              ].map((activity) => (
                <motion.div
                  key={activity}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  {activity}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}