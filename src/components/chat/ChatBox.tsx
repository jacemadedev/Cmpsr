import { SendHorizontal, Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { useStore } from '@/lib/store';

interface ChatBoxProps {
  isFullPage?: boolean;
}

export function ChatBox({ isFullPage = false }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { chats, currentChatId, addChat, addMessage, subscription } = useStore();

  const currentChat = currentChatId ? chats.find((chat) => chat.id === currentChatId) : null;
  const messages = currentChat?.messages || [];

  const tokenLimit = subscription?.tokenLimit || 10000;
  const tokensUsed = subscription?.tokensUsed || 0;
  const tokensLeft = Math.max(0, tokenLimit - tokensUsed);
  const isNearLimit = tokensUsed > tokenLimit * 0.8;

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      // If no chat exists, create one first
      if (!currentChatId) {
        addChat();
        // Get the latest state after adding chat
        const state = useStore.getState();
        // Send message to the newly created chat
        await addMessage(state.currentChatId!, message, true);
      } else {
        await addMessage(currentChatId, message, true);
      }
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    addChat();
    setMessage('');
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-black ${isFullPage ? 'h-full' : 'h-[400px]'}`}
    >
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-neutral-800"
      >
        <h2 className="font-medium text-gray-900 dark:text-white">
          {currentChat?.title || 'New Chat'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNewChat}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900"
          title="New Chat"
        >
          <Plus className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
        </motion.button>
      </motion.div>

      {/* Token Warning */}
      {isNearLimit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-b border-yellow-100 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20"
        >
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              {tokensLeft <= 0
                ? 'Monthly token limit reached. Please try again next month or upgrade your account.'
                : `Only ${tokensLeft.toLocaleString()} tokens left this month.`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full items-center justify-center text-gray-500 dark:text-neutral-400"
          >
            Start a new conversation
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id}
                message={msg.content}
                isUser={msg.isUser}
                animate={true}
                delay={index * 0.1}
              />
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2 rounded-2xl bg-gray-100 px-4 py-2 dark:bg-neutral-900">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-gray-100 p-4 dark:border-neutral-800"
      >
        <div className="flex gap-3">
          <motion.input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? 'AI is thinking...' : 'Type your message...'}
            disabled={isLoading || tokensLeft <= 0}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileFocus={{ scale: 1.02 }}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:disabled:bg-neutral-900"
          />
          <motion.button
            onClick={handleSend}
            disabled={isLoading || !message.trim() || tokensLeft <= 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 dark:hover:bg-blue-500 dark:disabled:bg-blue-600"
          >
            <SendHorizontal className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
