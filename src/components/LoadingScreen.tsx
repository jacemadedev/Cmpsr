import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4 text-center"
      >
        <div className="relative mx-auto h-16 w-16">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
