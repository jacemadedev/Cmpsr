import { Brain, Clock, MessageSquare, Terminal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HistoryItem } from '@/lib/types';

interface HistoryDetailsProps {
  item: HistoryItem;
  onClose: () => void;
}

export function HistoryDetails({ item, onClose }: HistoryDetailsProps) {
  const Icon = item.type === 'chat' ? MessageSquare : Terminal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-gray-100 bg-white dark:border-neutral-800 dark:bg-black"
      >
        <div className="border-b border-gray-100 p-6 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-neutral-900"
              >
                <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="mb-3 text-sm font-medium text-gray-600 dark:text-neutral-400">
              Request Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                <span className="text-sm text-gray-900 dark:text-white">Model: {item.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Response Time: {item.response_time}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-3 text-sm font-medium text-gray-600 dark:text-neutral-400">
              Usage Statistics
            </h3>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-900">
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Prompt Tokens</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.floor(item.tokens_used * 0.4)}
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Completion Tokens</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.floor(item.tokens_used * 0.6)}
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Total Tokens</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.tokens_used}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {item.messages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="mb-3 text-sm font-medium text-gray-600 dark:text-neutral-400">
                Conversation
              </h3>
              <div className="space-y-4">
                {item.messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 dark:bg-neutral-900 dark:text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(item.prompt || item.completion) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="mb-3 text-sm font-medium text-gray-600 dark:text-neutral-400">
                Raw Data
              </h3>
              <div className="space-y-4">
                {item.prompt && (
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Prompt
                    </p>
                    <pre className="overflow-auto rounded-xl bg-gray-50 p-4 text-sm dark:bg-neutral-900">
                      {item.prompt}
                    </pre>
                  </motion.div>
                )}
                {item.completion && (
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Completion
                    </p>
                    <pre className="overflow-auto rounded-xl bg-gray-50 p-4 text-sm dark:bg-neutral-900">
                      {item.completion}
                    </pre>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-gray-100 p-6 dark:border-neutral-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
